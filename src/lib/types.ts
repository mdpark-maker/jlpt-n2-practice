export type FlagStatus = 'unknown' | 'uncertain'
export type ExamLevel = 'n2' | 'n3'

export type QuestionData = {
  category: string
  question: string
  options: string[]
  correct_answer: string // 'A' | 'B' | 'C' | 'D'
  explanation: string      // Japanese
  explanation_ko?: string  // Korean
}

export type ExamQuestion = {
  id: string
  session_id: string
  user_id: string
  question_data: QuestionData
  position: number
  flag_status: FlagStatus | null
  user_answer: string | null
  is_correct: boolean | null
  answered_at: string | null
  created_at: string
}

export type ExamSession = {
  id: string
  user_id: string
  status: 'in_progress' | 'completed'
  score: number | null
  total_questions: number
  level: ExamLevel
  created_at: string
  completed_at: string | null
  is_retry?: boolean
}

export type ExamCategory = 'all' | '語彙' | '文法' | '読解' | '漢字'

export type ReviewItem = {
  id: string
  user_id: string
  question_data: QuestionData
  original_flag_status: FlagStatus | null
  level: ExamLevel
  created_at: string
}
