import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "@/store/store"
import { Root } from "react-dom/client"
import { set } from "react-hook-form"

// Định nghĩa interface cho dữ liệu generate state
export interface GenerateState {
  aiInputs: GenerateInput[] | null
  ai_name: string | null
  useImage: boolean
  useControlnet: boolean
  useCustomDimension: boolean
  useStyleImage: boolean
  dataInputs: [] | null
  history: ImageGroup[] | null
  aiStyleInputs: [] | null
  dataStyleInputs: { name: string, value: any, ArrayIndex?: number }[] | null
}

const initialState: GenerateState = {
  aiInputs: [],
  useImage: false,
  useControlnet: false,
  useCustomDimension: false,
  useStyleImage: false,
  ai_name: "",
  dataInputs: [],
  history: [],
  aiStyleInputs: [],
  dataStyleInputs: [],
}

export const generateSlice = createSlice({
  name: "generate",
  initialState,
  reducers: {
    setInputs: (state, action: PayloadAction<{ aiInputs: GenerateInput[] }>) => {
      state.aiInputs = action.payload.aiInputs
    },
    setAIStyleInputs: (state, action: PayloadAction<{ aiStyleInputs: [] }>) => {
      state.aiStyleInputs = action.payload.aiStyleInputs
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
    setUseControlnet: (
      state,
      action: PayloadAction<{ useControlnet: boolean }>,
    ) => {
      state.useControlnet = action.payload.useControlnet
    },
    setUseCustomDimension: (
      state,
      action: PayloadAction<{ useCustomDimension: boolean }>,
    ) => {
      state.useCustomDimension = action.payload.useCustomDimension
    },
    setUseStyleImage: (
      state,
      action: PayloadAction<{ useStyleImage: boolean }>,
    ) => {
      state.useStyleImage = action.payload.useStyleImage
    },
    setField: (
      state,
      action: PayloadAction<{ field: string; value?: any; delete?: boolean }>,
    ) => {
      const { field, value, delete: deleteField } = action.payload
      const dataInputs = state.dataInputs as { name: string; value: any }[]

      if (dataInputs) {
        const existingFieldIndex = dataInputs.findIndex(
          (item) => item.name === field,
        )
        if (deleteField) {
          if (existingFieldIndex !== -1) {
            dataInputs.splice(existingFieldIndex, 1)
          }
        } else {
          if (existingFieldIndex !== -1) {
            dataInputs[existingFieldIndex].value = value
          } else {
            dataInputs.push({ name: field, value })
          }
        }
      }
    },

    setDimension: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      const dataInputs = state.dataInputs as
        | { name: string; value: any }[]
        | null
      if (dataInputs) {
        // Kiểm tra sự tồn tại của dataInputs
        const existingWidthIndex = dataInputs.findIndex(
          (item) => item.name === "width",
        )
        const existingHeightIndex = dataInputs.findIndex(
          (item) => item.name === "height",
        )

        if (existingWidthIndex !== -1) {
          dataInputs[existingWidthIndex].value = action.payload.width
        } else {
          dataInputs.push({ name: "width", value: action.payload.width })
        }

        if (existingHeightIndex !== -1) {
          dataInputs[existingHeightIndex].value = action.payload.height
        } else {
          dataInputs.push({ name: "height", value: action.payload.height })
        }
      }
    },

    setStyleField: (
      state,
      action: PayloadAction<{ field: string; value?: any; delete?: boolean; ArrayIndex?: number }>,
    ) => {
      const { field, value, delete: deleteField, ArrayIndex } = action.payload;
      const dataStyleInputs = state.dataStyleInputs as {
        name: string;
        value: any;
        ArrayIndex?: number;
      }[];
    
      if (dataStyleInputs) {
        const existingFieldIndex = dataStyleInputs.findIndex(
          (item) => item.name === field && (ArrayIndex === undefined || item.ArrayIndex === ArrayIndex),
        );
    
        if (deleteField) {
          if (ArrayIndex !== undefined) {
            for (let i = dataStyleInputs.length - 1; i >= 0; i--) {
              if (dataStyleInputs[i].ArrayIndex === ArrayIndex) {
                dataStyleInputs.splice(i, 1);
              }
            }
          } else if (existingFieldIndex !== -1) {
            dataStyleInputs.splice(existingFieldIndex, 1);
          }
        } else {
          if (existingFieldIndex !== -1) {
            dataStyleInputs[existingFieldIndex].value = value;
          } else {
            dataStyleInputs.push({ name: field, value, ArrayIndex });
          }
        }
      }
    },
    

    eraseStyleFields: (state, action: PayloadAction<{ arrayType: string, arrayIndex: number }>) => {
      const { arrayType, arrayIndex } = action.payload
      const dataStyleInputs = state.dataStyleInputs as {
        name: string
        value: any
      }[]

      state.dataStyleInputs = dataStyleInputs.filter(
        (item) => !item.name.startsWith(`${arrayType}[${arrayIndex}]`)
      )
    },
  },
})

export const selectGenerate = (state: RootState) => state.generate

export const {
  setInputs,
  setAIStyleInputs,
  setUseImage,
  setUseControlnet,
  setDimension,
  setHistory,
  setUseCustomDimension,
  setUseStyleImage,
  setAIName,
  setField,
  setStyleField,
  eraseStyleFields
} = generateSlice.actions

export default generateSlice.reducer
