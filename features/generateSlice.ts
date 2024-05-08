import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@/store/store"
import { Root } from "react-dom/client"

// Định nghĩa interface cho dữ liệu generate state
export interface GenerateState {
  aiInputs: [] | null
  ai_name: string | null
  useImage: boolean
  useCustomDimension: boolean,
  dataInputs:  [] | null
  history: ImageGroup[] | null
}

const initialState: GenerateState = {
  aiInputs: [],
  useImage: false,
  useCustomDimension: false,
  ai_name: "",
  dataInputs: [],
  history: []
}

export const generateSlice = createSlice({
  name: "generate",
  initialState,
  reducers: {
    setInputs: (state, action: PayloadAction<{ aiInputs: [] }>) => {
      state.aiInputs = action.payload.aiInputs
    },
    setAIName: (state, action: PayloadAction<{ ai_name: string }>) => {
      state.ai_name = action.payload.ai_name
    },
    setHistory: (state, action: PayloadAction<{ history: ImageGroup[] }>) => {
      state.history = action.payload.history
    },
    setUseImage: (state, action: PayloadAction<{ useImage: boolean }>) => {
      state.useImage = action.payload.useImage
    },
    setUseCustomDimension: (state, action: PayloadAction<{ useCustomDimension: boolean }>) => {
      state.useCustomDimension = action.payload.useCustomDimension
    },
    setField : (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      const dataInputs = state.dataInputs as { name: string; value: any }[];

      if (dataInputs) {
        const existingFieldIndex = dataInputs.findIndex(item => item.name === field);
    if (existingFieldIndex !== -1) {
      dataInputs[existingFieldIndex].value = value;
    } else {
      dataInputs.push({ name: field, value });
    }
      }
    },
   
    setDimension: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      const dataInputs = state.dataInputs as { name: string; value: any }[] | null;
      if (dataInputs) {
        // Kiểm tra sự tồn tại của dataInputs
        const existingWidthIndex = dataInputs.findIndex(item => item.name === "width");
        const existingHeightIndex = dataInputs.findIndex(item => item.name === "height");
    
        if (existingWidthIndex !== -1) {
          dataInputs[existingWidthIndex].value = action.payload.width;
        } else {
          dataInputs.push({ name: "width", value: action.payload.width });
        }
    
        if (existingHeightIndex !== -1) {
          dataInputs[existingHeightIndex].value = action.payload.height;
        } else {
          dataInputs.push({ name: "height", value: action.payload.height });
        }
      }
    },
   
  },
})

export const selectGenerate = (state: RootState) => state.generate

export const {
  setInputs,
  setUseImage,
  setDimension,
  setHistory,
  setUseCustomDimension,
  setAIName,
  setField
} = generateSlice.actions

export default generateSlice.reducer
