import { number } from "zod"

export type DashboardImage = {
  image: {
    id: number
    prompt: string
    type: string
    url: string
    userId: number
  }
  like: number
}
