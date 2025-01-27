import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteBankById,
  getAllBankApi,
} from "@/services/admin/bank/bank.service";
import toast from "react-hot-toast";
import { createNewCompanyApi } from "@/services/admin/companies/companies.service";

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

export const createNewCompany = createAsyncThunk(
  "company/create",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewCompanyApi(values);
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

const companiesSlice = createSlice({
  name: "company",
  initialState: {
    companyList: [],
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

      .addCase(createNewCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        state.bankList.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewCompany.rejected, (state, action) => {
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

export default companiesSlice.reducer;
