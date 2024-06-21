import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { Root } from "react-dom/client";
import { AlbumData, Image, Person } from "@/types/profile";

export interface AuthState{
  token: string | null;
  userData: Person | null
  totalAlbum: AlbumData[] | null
  totalImages: Image[] | null
}

const initialState:AuthState ={
  token: null,
  userData: null,
  totalAlbum: null,
  totalImages: null,
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
  },
  setUserData:(
    state, action: PayloadAction<{userData: Person}>
  ) => {
    state.userData = action.payload.userData

},

setTotalAlbum:(
  state, action: PayloadAction<{totalAlbum: AlbumData[]}>
) => {
  state.totalAlbum = action.payload.totalAlbum
  
},
setTotalImage:(
  state, action: PayloadAction<{totalImage: Image[]}>
) => {
  state.totalImages = action.payload.totalImage

},
  }
})

export const selectAuth = (state: RootState) => state.auth;

export const {setUser, logout, setUserData, setTotalAlbum, setTotalImage} = authSlice.actions;

export default authSlice.reducer
