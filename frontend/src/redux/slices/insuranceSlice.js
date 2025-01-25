import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import {
  createNewInsuranceApi,
  deleteInsuranceById,
  getAllInsuranceApi,
} from "@/services/admin/insurance/insurance.service";

export const fetchAllInsurance = createAsyncThunk(
  "insurance/fetchAllInsurance",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllInsuranceApi();
      return data.allInsurance;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

export const createNewInsurance = createAsyncThunk(
  "insurance/create",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewInsuranceApi(values);
      toast.success(data.message);
      return data.createdInsurance;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);
export const deleteInsurance = createAsyncThunk(
  "insurance/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteInsuranceById(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

const insuranceSlice = createSlice({
  name: "insurance",
  initialState: {
    insuranceList: [],
    isLoading: true,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllInsurance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllInsurance.fulfilled, (state, action) => {
        state.insuranceList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllInsurance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createNewInsurance.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewInsurance.fulfilled, (state, action) => {
        state.insuranceList.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewInsurance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteInsurance.fulfilled, (state, action) => {
        state.insuranceList = state.insuranceList.filter(
          (insurance) => insurance.id !== action.payload,
        );
      });
  },
});

export default insuranceSlice.reducer;
