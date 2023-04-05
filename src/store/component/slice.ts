import { Data } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState: {
  value: Data[];
} = {
  value: [],
};

export const componentSlice = createSlice({
  name: "components",
  initialState,
  reducers: {
    updateData: (state: { value: Data[] }, action: PayloadAction<Data>) => {
      state.value = state.value.map((i) => {
        if (i._id === action.payload._id) {
          return {
            ...action.payload,
          };
        }
        return i;
      });
    },
    addData: (state: { value: Data[] }, action: PayloadAction<Data>) => {
      console.log(state.value.some((i) => i._id === action.payload._id));
      if (state.value.some((i) => i._id === action.payload._id)) {
        return state;
      }

      state.value = [...state.value, { ...action.payload }];
    },

    updateAllData: (
      state: { value: Data[] },
      action: PayloadAction<Data[]>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { updateData, addData, updateAllData } = componentSlice.actions;
export const selectComponents = (state: RootState) =>
  state.components.present.value;
