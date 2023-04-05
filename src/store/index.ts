import { TIME_SAVE_DATA_DEBOUNCE } from "@/constants";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import undoable from "redux-undo";
import { componentSlice } from "./component/slice";

let filter: any;
export const store = configureStore({
  reducer: {
    [componentSlice.name]: undoable(componentSlice.reducer, {
      filter: () => {
        // debounce save past data
        if (!filter) {
          filter = setTimeout(() => {
            filter = false;
          }, TIME_SAVE_DATA_DEBOUNCE);
          return true;
        }
        return false;
      },
    }),
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
