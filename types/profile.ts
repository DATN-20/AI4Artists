export interface Social {
  socialLink: string;
  socialName: string;
}

export interface Person {
  firstName: string;
  lastName: string;
  aliasName?: string;
  phone: string;
  address: string;
  description: string;
  socials: Social[];
}
export interface requestData {
  firstName: string
  lastName: string
  aliasName: string
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
