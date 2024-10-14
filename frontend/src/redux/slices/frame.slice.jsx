import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { createFrameCategoryApi } from "@/services/admin/frame/frame.service";

export const createNewFrameCategory = createAsyncThunk(
  "employee/createNewFrameCategory",
  async (values, { rejectWithValue }) => {
    try {
      const newCategory = await createFrameCategoryApi(values);
      if (newCategory.statusCode === 201) {
        toast.success(newCategory.message);
        return newCategory.newFrameCategory;
      }
    } catch (error) {
      const data = error?.response?.data.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

const frameSlice = createSlice({
  name: "frame",
  initialState: {
    frameCategory: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(createNewFrameCategory.fulfilled, (state, action) => {
      state.frameCategory.push(action.payload);
    });
  },
});

export default frameSlice.reducer;
