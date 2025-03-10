import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  createFrameCategoryApi,
  createFrameGenderApi,
  createFrameTypeApi,
  createNewFrameApi,
  deleteFrameByIdApi,
  deleteFrameCategoryByIdApi,
  deleteFrameGenderByIdApi,
  deleteFrameTypeByIdApi,
  getAllFrameApi,
  getAllFrameCategoryApi,
  getAllFrameGenderApi,
  getAllFrameTypeApi,
  updateFrameApi,
} from "@/services/admin/frame/frame.service";

export const fetchAllFrame = createAsyncThunk(
  "frame/fetchAllFrame",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFrameApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const createNewFrame = createAsyncThunk(
  "frame/createNewFrame",
  async (values, { rejectWithValue }) => {
    try {
      const newFrameData = await createNewFrameApi(values);
      if (newFrameData.statusCode === 201) {
        toast.success(newFrameData.message);
        return newFrameData.newFrame;
      }
    } catch (error) {
      const data = error?.response?.data.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  },
);

export const updateFrame = createAsyncThunk(
  "frame/updateFrame",
  async (values, { rejectWithValue }) => {
    try {
      const updatedFrame = await updateFrameApi(values);
      if (updatedFrame.statusCode === 200) {
        toast.success(updatedFrame.message);
        return updatedFrame.updatedFrame;
      }
    } catch (error) {
      const data = error?.response?.data.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  },
);

export const deleteFrame = createAsyncThunk(
  "frame/deleteFrame",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteFrameByIdApi(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

export const createNewFrameCategory = createAsyncThunk(
  "frame/createNewFrameCategory",
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
  },
);

export const fetchAllFrameCategories = createAsyncThunk(
  "frame/fetchAllFrameCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFrameCategoryApi();
      return data.allFrameCategories;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteFrameCategory = createAsyncThunk(
  "frame/deleteFrameCategory",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteFrameCategoryByIdApi(id);

      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

export const createNewFrameType = createAsyncThunk(
  "frame/createNewFrameType",
  async (values, { rejectWithValue }) => {
    try {
      const newType = await createFrameTypeApi(values);
      if (newType.statusCode === 201) {
        toast.success(newType.message);
        return newType.newFrameType;
      }
    } catch (error) {
      const data = error?.response?.data.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  },
);

export const fetchAllFrameType = createAsyncThunk(
  "frame/fetchAllFrameType",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFrameTypeApi();
      return data.allFrameType;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteFrameType = createAsyncThunk(
  "frame/deleteFrameType",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteFrameTypeByIdApi(id);

      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

export const createNewFrameGender = createAsyncThunk(
  "frame/createNewFrameGender",
  async (values, { rejectWithValue }) => {
    try {
      const newType = await createFrameGenderApi(values);
      if (newType.statusCode === 201) {
        toast.success(newType.message);
        return newType.newFrameGender;
      }
    } catch (error) {
      const data = error?.response?.data.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  },
);

export const fetchAllFrameGender = createAsyncThunk(
  "frame/fetchAllFrameGender",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllFrameGenderApi();
      return data.allFrameGender;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteFrameGender = createAsyncThunk(
  "frame/deleteFrameGender",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteFrameGenderByIdApi(id);

      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

const frameSlice = createSlice({
  name: "frame",
  initialState: {
    frameList: [],
    frameCategory: [],
    frameType: [],
    frameGender: [],
    totalInventoryValue: "",
    totalColorCount: 0,
    genderArray: [],
    frameTypeArray: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewFrameCategory.fulfilled, (state, action) => {
        state.frameCategory.push(action.payload);
      })
      .addCase(fetchAllFrameCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFrameCategories.fulfilled, (state, action) => {
        state.frameCategory = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllFrameCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllFrame.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFrame.fulfilled, (state, action) => {
        state.frameList = action.payload.frames;
        state.totalInventoryValue = action.payload.totalInventoryValue;
        state.totalColorCount = action.payload.totalColorCount;
        state.frameTypeArray = action.payload.frameTypeArray;
        state.genderArray = action.payload.genderArray;
        state.isLoading = false;
      })
      .addCase(fetchAllFrame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFrame.fulfilled, (state, action) => {
        state.frameList = state.frameList.filter(
          (frame) => frame.frameId !== action.payload,
        );
      })
      .addCase(deleteFrameCategory.fulfilled, (state, action) => {
        state.frameCategory = state.frameCategory.filter(
          (FCategory) => FCategory.id !== action.payload,
        );
      })
      .addCase(createNewFrameType.fulfilled, (state, action) => {
        state.frameType.push(action.payload);
      })
      .addCase(createNewFrame.fulfilled, (state, action) => {
        state.frameList.push(action.payload);
      })
      .addCase(fetchAllFrameType.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFrameType.fulfilled, (state, action) => {
        state.frameType = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllFrameType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFrameType.fulfilled, (state, action) => {
        state.frameType = state.frameType.filter(
          (FType) => FType.id !== action.payload,
        );
      })
      .addCase(createNewFrameGender.fulfilled, (state, action) => {
        state.frameGender.push(action.payload);
      })
      .addCase(fetchAllFrameGender.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFrameGender.fulfilled, (state, action) => {
        state.frameGender = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllFrameGender.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteFrameGender.fulfilled, (state, action) => {
        state.frameGender = state.frameGender.filter(
          (FGender) => FGender.id !== action.payload,
        );
      })
      .addCase(updateFrame.fulfilled, (state, action) => {
        const index = state.frameList.findIndex(
          (frame) => frame.frameId === action.payload.id,
        );
        if (index !== -1) {
          state.frameList[index] = action.payload;
        }
      });
  },
});

export default frameSlice.reducer;
