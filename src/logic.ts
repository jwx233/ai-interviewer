import { createId } from './id'
import type { ChoiceOption, Difficulty, InterviewQuestion, InterviewReport, InterviewTurn, QuestionType } from './types'

const optionIds = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function normalizeQuestion(value: unknown): unknown {
  if (!value || typeof value !== 'object') return value
  const raw = value as Record<string, unknown>
  const options = Array.isArray(raw.options)
    ? raw.options.map((option, index): ChoiceOption => typeof option === 'string'
      ? { id: optionIds[index] ?? String(index + 1), text: option }
      : option as ChoiceOption)
    : undefined
  const correctAnswers = Array.isArray(raw.correctAnswers)
    ? raw.correctAnswers.map(String)
    : typeof raw.correctAnswer === 'string'
      ? [raw.correctAnswer]
      : undefined
  return {
    ...raw,
    id: typeof raw.id === 'string' && raw.id ? raw.id : createId(),
    type: raw.type as QuestionType,
    difficulty: raw.difficulty as Difficulty,
    options,
    correctAnswers,
  }
}

export function validateQuestion(value: unknown): value is InterviewQuestion {
  if (!value || typeof value !== 'object') return false
  const q = value as InterviewQuestion
  if (!q.id || !q.question || !q.topic || !['single_choice','multiple_choice','open_answer'].includes(q.type)) return false
  if (q.type !== 'open_answer') return !!q.options?.length && q.options.every((o) => !!o.id && !!o.text) && !!q.correctAnswers?.length && q.correctAnswers.every((id) => q.options?.some((o) => o.id === id))
  return true
}
export function scoreChoice(question: InterviewQuestion, answer: string[]) {
  const expected = [...(question.correctAnswers ?? [])].sort()
  const actual = [...answer].sort()
  if (JSON.stringify(expected) === JSON.stringify(actual)) return 100
  const hits = actual.filter((item) => expected.includes(item)).length
  return expected.length ? Math.round((hits / expected.length) * 60) : 0
}
export function buildLocalReport(turns: InterviewTurn[]): InterviewReport {
  const scores = turns.map((turn) => turn.evaluation?.score ?? (turn.question.type === 'open_answer' ? (String(turn.answer).length > 60 ? 75 : 55) : scoreChoice(turn.question, turn.answer as string[])))
  const totalScore = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
  const wrong = turns.filter((turn,index)=>scores[index]<70).map((turn)=>turn.question.topic)
  return { totalScore, dimensions:{'技术准确性':totalScore,'表达结构':Math.min(100,totalScore+3),'项目深度':Math.max(0,totalScore-5),'岗位匹配度':totalScore,'应变能力':Math.min(100,totalScore+1)},summary:totalScore>=80?'整体表现扎实，具备良好的岗位基础。':'基础能力已体现，建议针对薄弱主题继续练习。',strengths:['能够完成完整面试流程','对主要问题给出了有效回应'],weaknesses:[...new Set(wrong)].slice(0,4),learningPlan:['复盘本次错题与参考答案','使用 STAR 法重写项目经历','针对薄弱主题完成一次专项练习'] }
}
export function parseJsonObject(text: string) {
  const cleaned = text.replace(/^```json\s*/i,'').replace(/```$/,'').trim()
  return JSON.parse(cleaned) as unknown
}
