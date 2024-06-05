interface NotificationInfo {
    id: number
    title: string
    content: string
    type: string
    user: {
      id: number
      first_name: string
      last_name: string
      alias_name: string
      avatar: string
    }
    is_read: boolean
    reference_data: string | null
    created_at: string
  }