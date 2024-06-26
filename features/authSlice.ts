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

// Hàm để thiết lập cookie
function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Hàm để xóa tất cả cookie
function eraseAllCookies() {
  // Lấy tất cả các cookie hiện có
  var cookies = document.cookie.split(";");

  // Lặp qua từng cookie và xóa nó
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      // Thiết lập thời gian hết hạn của cookie về quá khứ để xóa nó
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
}



export const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers: {
    setUser:(
      state, action: PayloadAction<{token:string}>
    ) => {
      setCookie("token", action.payload.token, 1);
  
    state.token = action.payload.token;
  },
  logout: (state) => {
    localStorage.clear();
    eraseAllCookies()
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
