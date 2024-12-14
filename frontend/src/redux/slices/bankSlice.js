import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewBankApi,
  deleteBankById,
  getAllBankApi,
} from "@/services/admin/bank/bank.service";
import toast from "react-hot-toast";

export const fetchAllBanks = createAsyncThunk(
  "bank/fetchAllBank",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllBankApi();
      return data.allBanks;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

export const createNewBank = createAsyncThunk(
  "bank/create",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewBankApi(values);
      toast.success(data.message);
      return data.createdBank;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);
export const deleteBank = createAsyncThunk(
  "bank/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteBankById(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);

const bankSlice = createSlice({
  name: "bank",
  initialState: {
    bankList: [],
    isLoading: true,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBanks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllBanks.fulfilled, (state, action) => {
        state.bankList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createNewBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewBank.fulfilled, (state, action) => {
        state.bankList.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewBank.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.bankList = state.bankList.filter(
          (bank) => bank.BankId !== action.payload,
        );
      });
  },
});

export default bankSlice.reducer;
