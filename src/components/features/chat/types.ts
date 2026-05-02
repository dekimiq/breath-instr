export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface Limits {
  remaining: number
  total: number
}
