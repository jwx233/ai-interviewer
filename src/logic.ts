import { createId } from './id'
import type { ChoiceOption, Difficulty, InterviewQuestion, InterviewReport, InterviewReview, InterviewTurn, QuestionType, TurnEvaluation } from './types'

const optionIds = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function normalizeQuestion(value: unknown, defaults?: { difficulty?: Difficulty; topic?: string }): unknown {
  if (!value || typeof value !== 'object') return value
  const outer = value as Record<string, unknown>
  const raw = outer.question && typeof outer.question === 'object' ? outer.question as Record<string, unknown> : outer
  const rawOptions = Array.isArray(raw.options)
    ? raw.options
    : raw.options && typeof raw.options === 'object'
      ? Object.entries(raw.options).map(([id, text]) => ({ id, text }))
      : undefined
  const options = rawOptions
    ? rawOptions.map((option, index): ChoiceOption => {
      if (typeof option === 'string') return { id: optionIds[index] ?? String(index + 1), text: option }
      const item = option as Record<string, unknown>
      return {
        id: String(item.id ?? item.key ?? item.label ?? optionIds[index] ?? index + 1),
        text: String(item.text ?? item.content ?? item.value ?? item.label ?? ''),
      }
    })
    : undefined
  const rawAnswers = raw.correctAnswers ?? raw.correctAnswer ?? raw.answer
  const correctAnswers = Array.isArray(rawAnswers)
    ? rawAnswers.map(String)
    : typeof rawAnswers === 'string' || typeof rawAnswers === 'number'
      ? [String(rawAnswers)]
      : undefined
  const normalizedAnswers = correctAnswers?.map((answer) => {
    const byId = options?.find((option) => option.id === answer)
    if (byId) return byId.id
    const byText = options?.find((option) => option.text === answer)
    if (byText) return byText.id
    const numericIndex = Number(answer)
    return Number.isInteger(numericIndex) && numericIndex >= 0 && options?.[numericIndex] ? options[numericIndex].id : answer
  })
  const typeAliases: Record<string, QuestionType> = {
    single: 'single_choice', single_choice: 'single_choice', 单选: 'single_choice', 单选题: 'single_choice',
    multiple: 'multiple_choice', multiple_choice: 'multiple_choice', 多选: 'multiple_choice', 多选题: 'multiple_choice',
    open: 'open_answer', open_answer: 'open_answer', 开放题: 'open_answer', 问答题: 'open_answer',
  }
  return {
    ...raw,
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    question: typeof raw.question === 'string' ? raw.question : String(raw.title ?? raw.content ?? ''),
    topic: typeof raw.topic === 'string' && raw.topic ? raw.topic : defaults?.topic ?? '综合能力',
    type: typeAliases[String(raw.type ?? raw.questionType ?? '')] ?? raw.type as QuestionType,
    difficulty: (raw.difficulty ?? defaults?.difficulty) as Difficulty,
    options,
    correctAnswers: normalizedAnswers,
    explanation: raw.explanation ?? raw.analysis,
    referenceAnswer: raw.referenceAnswer ?? raw.reference,
  }
}

export function validateQuestion(value: unknown): value is InterviewQuestion {
  if (!value || typeof value !== 'object') return false
  const q = value as InterviewQuestion
  if (!q.id || !q.question || !q.topic || !['single_choice','multiple_choice','open_answer'].includes(q.type)) return false
  if (q.type !== 'open_answer') return !!q.options?.length && q.options.every((o) => !!o.id && !!o.text) && !!q.correctAnswers?.length && q.correctAnswers.every((id) => q.options?.some((o) => o.id === id))
  return true
}
export function normalizeQuestions(value: unknown, defaults?: { difficulty?: Difficulty; topic?: string }) {
  const raw = value && typeof value === 'object' && !Array.isArray(value)
    ? ((value as Record<string, unknown>).questions ?? value)
    : value
  if (!Array.isArray(raw)) return []
  return raw.map((question) => normalizeQuestion(question, defaults)).filter(validateQuestion)
}
export function mergeReview(turns: InterviewTurn[], review: InterviewReview) {
  return turns.map((turn, index) => ({ ...turn, evaluation: review.evaluations[index] ?? turn.evaluation }))
}
export function buildLocalEvaluation(turn: InterviewTurn): TurnEvaluation {
  const score = turn.skipped ? 0 : turn.question.type === 'open_answer'
    ? (String(turn.answer).length > 60 ? 75 : 55)
    : scoreChoice(turn.question, turn.answer as string[])
  return {
    score,
    feedback: turn.skipped ? '本题已跳过。' : score >= 80 ? '回答准确且结构较完整。' : '建议结合参考答案进一步补充关键点。',
    strengths: score >= 80 ? ['回答覆盖了主要考点'] : [],
    improvements: score < 80 ? ['补充关键概念、方案取舍与实际结果'] : [],
    followUpNeeded: false,
  }
}
export function scoreChoice(question: InterviewQuestion, answer: string[]) {
  const expected = [...(question.correctAnswers ?? [])].sort()
  const actual = [...answer].sort()
  if (JSON.stringify(expected) === JSON.stringify(actual)) return 100
  const hits = actual.filter((item) => expected.includes(item)).length
  return expected.length ? Math.round((hits / expected.length) * 60) : 0
}
export function buildLocalReport(turns: InterviewTurn[]): InterviewReport {
  const scores = turns.map((turn) => turn.evaluation?.score ?? buildLocalEvaluation(turn).score)
  const totalScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
  const wrong = turns.filter((turn,index)=>scores[index]<70).map((turn)=>turn.question.topic)
  return { totalScore, dimensions:{'技术准确性':totalScore,'表达结构':Math.min(100,totalScore+3),'项目深度':Math.max(0,totalScore-5),'岗位匹配度':totalScore,'应变能力':Math.min(100,totalScore+1)},summary:totalScore>=80?'整体表现扎实，具备良好的岗位基础。':'基础能力已体现，建议针对薄弱主题继续练习。',strengths:['能够完成完整面试流程','对主要问题给出了有效回应'],weaknesses:[...new Set(wrong)].slice(0,4),learningPlan:['复盘本次错题与参考答案','使用 STAR 法重写项目经历','针对薄弱主题完成一次专项练习'] }
}
export function parseJsonObject(text: string) {
  const cleaned = text.replace(/^```json\s*/i,'').replace(/```$/,'').trim()
  return JSON.parse(cleaned) as unknown
}
