import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { checkOtpApi, logOutApi } from "@/services/auth/auth.service";
import { getUserProfileApi } from "@/services/user/user.service";
import toast from "react-hot-toast";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ phoneNumber, code }, { rejectWithValue }) => {
    try {
      const { data } = await checkOtpApi({ phoneNumber, code });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await getUserProfileApi();
      return user;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logOutUser = createAsyncThunk(
  "auth/logOutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await logOutApi();
      if (data.statusCode === 200) {
        toast.success(data.message);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        if (action.payload.statusCode === 200) {
          state.user = null;
          state.isLoading = false;
          state.error = null;
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
