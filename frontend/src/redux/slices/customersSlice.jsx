import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  createNewInvoiceApi,
  getLastInvoiceNumberApi,
  getOrderLensDailyApi,
} from "@/services/customers/customers.service";

export const createNewInvoice = createAsyncThunk(
  "customer/createNewInvoice",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewInvoiceApi(values);
      toast.success(data.message);
      return data.data;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);
export const getLastInvoiceNumber = createAsyncThunk(
  "customer/invoiceNumber",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getLastInvoiceNumberApi();
      return data.invoiceNumber;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  },
);
export const getOrderLensDaily = createAsyncThunk(
  "orderLens/getDaily",
  async (date, thunkAPI) => {
    try {
      const response = await getOrderLensDailyApi(date);
      return response.lensOrdersDaily;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customersList: [],
    invoiceList: [],
    orderLensDaily: [],
    lastInvoiceNumber: 0,
    isLoading: true,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      // .addCase(fetchAllBanks.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(fetchAllBanks.fulfilled, (state, action) => {
      //   state.bankList = action.payload;
      //   state.isLoading = false;
      // })
      // .addCase(fetchAllBanks.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.payload;
      // })

      .addCase(createNewInvoice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.invoiceList.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createNewInvoice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getLastInvoiceNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLastInvoiceNumber.fulfilled, (state, action) => {
        state.lastInvoiceNumber = action.payload;
        state.isLoading = false;
      })
      .addCase(getLastInvoiceNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrderLensDaily.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderLensDaily.fulfilled, (state, action) => {
        state.orderLensDaily = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrderLensDaily.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
