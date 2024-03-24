import { number } from "zod"

export type DashboardImage = {
  id: number
  promp: string
  type: string
  url: string
  userId: number
  ai_name: string
  style: string
  created_at: string
  created_user: {
    id: number
    first_name: string
    last_name: string
    alias_name: string
  }
  is_liked: boolean
  like_number: number
}
