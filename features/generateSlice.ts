import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Root } from "react-dom/client";

interface AIField {
  ai_name: string | null;
  inputs: InputField[];
}

interface DataInputs {
  aiName: string,
  positivePrompt: string
  negativePrompt: string; // Chuỗi mô tả negative prompt
  style: string; // Loại style, có thể là bất kỳ kiểu nào
  width: number; // Chiều rộng ảnh
  height: number; // Chiều cao ảnh
  numberOfImage: number; // Số lượng ảnh được tạo
  steps: number; // Số bước trong quá trình tạo ảnh
  sampleMethod: string; // Phương pháp lấy mẫu
  cfg: number; // Cấu hình (không rõ ý nghĩa cụ thể)
  noise: number; // Độ nhiễu
}

// Định nghĩa interface cho dữ liệu generate state
export interface GenerateState {
  aiInputs: AIField[] | null;
  useImage: boolean;
  dataInputs: DataInputs | null;
}

// Định nghĩa interface cho các trường dữ liệu input
interface InputField {
  name: string;
  default: string | number | null;
  typeName: string;
  max?: number;
  min?: number;
  step?: number;
  info?: {
    choices?: Record<string, string>;
  };}

const initialState:GenerateState ={
  aiInputs: [],
  useImage: false,
  dataInputs: {
    aiName: "",
  positivePrompt: "",
  negativePrompt: "", 
  style: "", 
  width: 512, 
  height: 512, 
  numberOfImage: 1,
  steps: 20,
  sampleMethod: "euler", 
  cfg: 8,
  noise: 0.75,
  }
}
export const generateSlice = createSlice({
  name:"generate",
  initialState,
  reducers: {
    setInputs: (
      state, action: PayloadAction<{aiInputs: AIField[]}>
    ) => {
     
  
    state.aiInputs = action.payload.aiInputs;
  },
    setUseImage: (
      state, action: PayloadAction<{ useImage: boolean}>
    ) => {
    state.useImage = action.payload.useImage;
  },
    setPositivePrompt:(
      state, action: PayloadAction<{ value: string}>
    ) => {
      if (state.dataInputs) {
        state.dataInputs.positivePrompt = action.payload.value;
      }  },
  }
})

export const selectGenerate = (state: RootState) => state.generate;

export const {setInputs, setUseImage, setPositivePrompt} = generateSlice.actions;

export default generateSlice.reducer
