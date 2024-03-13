import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@/store/store"
import { Root } from "react-dom/client"

interface AIField {
  ai_name: string | null
  inputs: InputField[]
}

interface DataInputs {
  aiName: string
  positivePrompt: string
  negativePrompt: string // Chuỗi mô tả negative prompt
  style: string // Loại style, có thể là bất kỳ kiểu nào
  width: number // Chiều rộng ảnh
  height: number // Chiều cao ảnh
  numberOfImage: number // Số lượng ảnh được tạo
  steps: number // Số bước trong quá trình tạo ảnh
  sampleMethod: string // Phương pháp lấy mẫu
  cfg: number // Cấu hình (không rõ ý nghĩa cụ thể)
  noise: number // Độ nhiễu
  image: string
}

// Định nghĩa interface cho dữ liệu generate state
export interface GenerateState {
  aiInputs: AIField[] | null
  useImage: boolean
  dataInputs: DataInputs | null
}

// Định nghĩa interface cho các trường dữ liệu input
interface InputField {
  name: string
  default: string | number | null
  typeName: string
  max?: number
  min?: number
  step?: number
  info?: {
    choices?: Record<string, string>
  }
}

const initialState: GenerateState = {
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
    image: "",
  },
}

export const generateSlice = createSlice({
  name: "generate",
  initialState,
  reducers: {
    setInputs: (state, action: PayloadAction<{ aiInputs: AIField[] }>) => {
      state.aiInputs = action.payload.aiInputs
      if (
        state.aiInputs &&
        state.dataInputs &&
        action.payload.aiInputs[0].ai_name
      ) {
        state.dataInputs.aiName = action.payload.aiInputs[0].ai_name
      }
      if (
        state.aiInputs &&
        state.dataInputs &&
        action.payload.aiInputs[0].inputs[0].default
      ) {
        state.dataInputs.style =
          action.payload.aiInputs[0].inputs[0].default.toString()
      }
    },
    setUseImage: (state, action: PayloadAction<{ useImage: boolean }>) => {
      state.useImage = action.payload.useImage
    },
    setPositivePrompt: (state, action: PayloadAction<{ value: string }>) => {
      if (state.dataInputs) {
        state.dataInputs.positivePrompt = action.payload.value
      }
    },
    setNegativePrompt: (state, action: PayloadAction<{ value: string }>) => {
      if (state.dataInputs) {
        state.dataInputs.negativePrompt = action.payload.value
      }
    },
    setNumberOfImage: (
      state,
      action: PayloadAction<{ numberOfImage: number }>,
    ) => {
      if (state.dataInputs) {
        state.dataInputs.numberOfImage = action.payload.numberOfImage
      }
    },
    setDimension: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      if (state.dataInputs) {
        state.dataInputs.width = action.payload.width
        state.dataInputs.height = action.payload.height
      }
    },
    setSteps: (state, action: PayloadAction<{ steps: number }>) => {
      if (state.dataInputs) {
        state.dataInputs.steps = action.payload.steps
      }
    },
    setCFG: (state, action: PayloadAction<{ cfg: number }>) => {
      if (state.dataInputs) {
        state.dataInputs.cfg = action.payload.cfg
      }
    },
    setNoise: (state, action: PayloadAction<{ noise: number }>) => {
      if (state.dataInputs) {
        state.dataInputs.noise = action.payload.noise
      }
    },
    setImageGenerate: (state, action: PayloadAction<{ image: string }>) => {
      if (state.dataInputs) {
        state.dataInputs.image = action.payload.image
      }
    },
  },
})

export const selectGenerate = (state: RootState) => state.generate

export const {
  setInputs,
  setUseImage,
  setPositivePrompt,
  setNegativePrompt,
  setNumberOfImage,
  setDimension,
  setSteps,
  setCFG,
  setNoise,
  setImageGenerate,
} = generateSlice.actions

export default generateSlice.reducer
