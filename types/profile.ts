export interface Social {
  social_name: string;
  social_link: string;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  description: string;
  socials: Social[];
  alias_name: string;
  role: string;
  avatar: string;
  background: string;
  created_at: Date;
  updated_at: Date;
}
export interface PersonData {
  data:{
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    description: string;
    socials: Social[];
    alias_name: string;
    role: string;
    avatar: string;
    background: string;
    created_at: Date;
    updated_at: Date;
  }
  
}

export interface requestData {
  firstName: string
  lastName: string
  aliasName: string
  phone:string
  address: string
  description: string
  profileImageUrl: string
  socials: { socialName: string; socialLink: string }[]
  avatar: string
  background: string
}
export interface ImageAlbum {
  id: number;
  userId: number;
  url: string;
  type: string;
  prompt: string;
  aiName: string | null;
  style: string | null;
  additionInfo: any | null; // Điều chỉnh kiểu nếu có thông tin cụ thể
  visibility: any | null; // Điều chỉnh kiểu nếu có thông tin cụ thể
  createdAt: string;
  storageId: string;
  generateId: any | null; // Điều chỉnh kiểu nếu có thông tin cụ thể
  like: number;
  remove_background: string;
  upscale: string;
  createdUser: any; // Kiểu dữ liệu của createdUser phụ thuộc vào dữ liệu thực tế
  isLiked: boolean;
  likeNumber: number | null;
}

export interface ImageTotal {
  id: number;
  userId: number;
  url: string;
  type: string;
  prompt: string;
  aiName: string | null;
  style: string | null;
  createdAt: string;
  createdUser: any; // Kiểu dữ liệu của createdUser phụ thuộc vào dữ liệu thực tế
  isLiked: boolean;
  likeNumber: number | null;
  visibility: boolean;

}

interface Album {
  id: number;
  userId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumWithImages {
  album: Album;
  images: ImageAlbum[];
}


export interface User {
  id: number;
  first_name: string;
  last_name: string;
  alias_name: string;
  avatar: string;
}

export interface Image {
  id: number;
  url: string;
  type: string;
  prompt: string;
  ai_name: string;
  style: string;
  created_at: string;
  created_user: User;
  is_liked: boolean;
  like_number: number;
  remove_background: string;
  upscale: string;
  visibility: boolean;
}

export interface AlbumType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  created_user: User;
}

export interface AlbumData {
  album: AlbumType;
  images: Image[];
}
