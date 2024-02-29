import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Root } from "react-dom/client";

export interface GenerateState{
  name: string | null;
  token: string | null;
}

const initialState:GenerateState ={
  name: null,
  token: null

}
export const generateSlice = createSlice({
  name:"generate",
  initialState,
  reducers: {
    
  }
})

export const selectGenerate = (state: RootState) => state.generate;

export const {} = generateSlice.actions;

export default generateSlice.reducer
