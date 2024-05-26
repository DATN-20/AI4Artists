interface Image {
  id: number;
  url: string;
  type: string;
  prompt: string;
  ai_name: string | null;
  style: string | null;
  created_at: string;
  created_user: any; 
  is_liked: boolean;
  like_number: number | null;
  visibility: boolean;
}

interface ImageGroup {
  style: string | null;
  prompt: string;
  images: Image[];
}

