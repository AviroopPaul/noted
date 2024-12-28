import { configureStore } from "@reduxjs/toolkit";
import pagesReducer from "./PagesSlice";

const store = configureStore({
  reducer: {
    pages: pagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
