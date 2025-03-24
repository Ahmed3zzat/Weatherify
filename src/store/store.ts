import { configureStore } from "@reduxjs/toolkit";
import { wweatherSlicer } from "./features/weather.slice";

export const store = configureStore({
  reducer: {
    wweatherSlicer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
