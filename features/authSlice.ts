import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Root } from "react-dom/client";

export interface AuthState{
  token: string | null;
}

const initialState:AuthState ={
  token: null

}
export const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers: {
    setUser:(
      state, action: PayloadAction<{name:string; token:string}>
    ) => {
      localStorage.setItem(
    "token",
      action.payload.token,
  );
  
    state.token = action.payload.token;
  },
  logout: (state) => {
    localStorage.clear();
    state.token = null;
  }
  }
})

export const selectAuth = (state: RootState) => state.auth;

export const {setUser, logout} = authSlice.actions;

export default authSlice.reducer
