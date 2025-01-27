import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  createNewCompanyApi,
  deleteCompanyById,
  getAllCompaniesApi,
} from "@/services/admin/companies/companies.service";

export const fetchAllCompanies = createAsyncThunk(
  "company/fetchAllBank",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllCompaniesApi();
      return data.allCompanies;
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
      return data.createdCompany;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);
export const deleteCompany = createAsyncThunk(
  "company/delete",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteCompanyById(id);
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
      .addCase(fetchAllCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.companyList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createNewCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewCompany.fulfilled, (state, action) => {
        state.companyList.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companyList = state.companyList.filter(
          (company) => company.CompanyId !== action.payload,
        );
      });
  },
});

export default companiesSlice.reducer;
