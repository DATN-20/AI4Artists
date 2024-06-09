
export type DashboardImage = {
  id: number
  prompt: string
  type: string
  url: string
  userId: number
  ai_name: string
  style: string | undefined
  created_at: string
  created_user: {
    id: number
    first_name: string
    last_name: string
    alias_name: string
    avatar: string
  }
  is_liked: boolean
  like_number: number
  remove_background: string
  upscale: string
  visibility: boolean
}

export type DashboardImageGroup = {
  style: string
  prompt: string
  images: DashboardImage[]
}

export type AllDashboardImageResponse = {
  data: DashboardImage[]
  total: number
  page: number
  limit: number
}