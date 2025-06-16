export type Question = {
  id: string
  question: string
  options: string[]
  correctOption: string
}

export type Quiz = {
  id: string
  title: string
  description: string
  questions: Question[]
}
