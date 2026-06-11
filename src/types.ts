export type Role = 'Java 后端' | '前端开发' | '软件测试' | '产品经理' | '自定义岗位'
export type Difficulty = '初级' | '中级' | '高级'
export type QuestionType = 'single_choice' | 'multiple_choice' | 'open_answer'
export interface CandidateProfile { role: string; summary: string; skills: string[]; projects: string[]; riskPoints: string[]; suggestedTopics: string[] }
export interface ChoiceOption { id: string; text: string }
export interface InterviewQuestion { id: string; type: QuestionType; question: string; topic: string; difficulty: Difficulty; options?: ChoiceOption[]; correctAnswers?: string[]; explanation?: string; referenceAnswer?: string }
export interface TurnEvaluation { score: number; feedback: string; strengths: string[]; improvements: string[]; followUpNeeded: boolean }
export interface InterviewTurn { question: InterviewQuestion; answer: string | string[]; evaluation?: TurnEvaluation; skipped?: boolean }
export interface InterviewConfig { role: Role; customRole: string; difficulty: Difficulty; duration: 10 | 20 | 30; resume: string; jd: string }
export interface InterviewReport { totalScore: number; dimensions: Record<string, number>; summary: string; strengths: string[]; weaknesses: string[]; learningPlan: string[] }
export interface InterviewPreparation { profile?: CandidateProfile; questions: InterviewQuestion[] }
export interface InterviewReview { evaluations: TurnEvaluation[]; report: InterviewReport }
export interface InterviewSession { id: string; config: InterviewConfig; profile?: CandidateProfile; questions: InterviewQuestion[]; turns: InterviewTurn[]; currentQuestion?: InterviewQuestion; startedAt: number; status: 'active' | 'reviewing' | 'completed'; report?: InterviewReport; aiMode: boolean; reviewStatus?: 'waiting' | 'ai_completed' | 'local_fallback'; reviewError?: string }
