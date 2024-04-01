import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { authApi } from "../services/auth/authApi"
import { setupListeners } from "@reduxjs/toolkit/query/react"
import authReducer from "../features/authSlice"
import { generateApi } from "../services/generate/generateApi"
import generateReducer from "../features/generateSlice"
import { dashboardApi } from "../services/dashboard/dashboardApi"
import { profileApi } from "../services/profile/profileApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    generate: generateReducer,
    [generateApi.reducerPath]: generateApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,


  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, generateApi.middleware, dashboardApi.middleware, profileApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
setupListeners(store.dispatch)
