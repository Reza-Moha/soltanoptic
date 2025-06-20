import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import {
  createNewInvoiceApi,
  getLastInvoiceNumberApi,
  getOrderLensDailyApi,
  getAllInvoicesApi,
  sendSmsDeliveryApi,
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

export const getAllInvoicesPaginated = createAsyncThunk(
  "customer/getAllInvoicesPaginated",
  async ({ page = 1, size = 30, search = "" }, thunkAPI) => {
    try {
      const response = await getAllInvoicesApi(page, size, search);
      return {
        invoices: response.invoices,
        pagination: response.pagination,
      };
    } catch (error) {
      toast.error("خطا در دریافت لیست قبض‌ها");
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  },
);
export const sendSmsDelivery = createAsyncThunk(
  "orderLens/sendSmsDelivery",
  async ({ invoiceId, userId }, { rejectWithValue }) => {
    try {
      const response = await sendSmsDeliveryApi({ invoiceId, userId });
      toast.success(response.message);
      return response.invoice;
    } catch (error) {
      toast.error(error?.response?.data?.errors?.message || "خطا در ارسال");
      return rejectWithValue(error?.response?.data || error.message);
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
    allInvoices: [],
    totalPages: 0,
    currentPage: 1,
    isLoading: true,
    invoicesLoading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
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
      })
      .addCase(getAllInvoicesPaginated.pending, (state) => {
        state.invoicesLoading = true;
      })
      .addCase(getAllInvoicesPaginated.fulfilled, (state, action) => {
        state.allInvoices = action.payload.invoices;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.page;
        state.invoicesLoading = false;
      })
      .addCase(getAllInvoicesPaginated.rejected, (state, action) => {
        state.invoicesLoading = false;
        state.error = action.payload;
      })
      .addCase(sendSmsDelivery.fulfilled, (state, action) => {
        const { InvoiceId } = action.payload;

        const index = state.orderLensDaily.findIndex(
          (invoice) => invoice.InvoiceId === InvoiceId,
        );
        if (index !== -1) {
          state.orderLensDaily[index].lensOrderStatus = "sendOrderSms";
        }
      })

      .addCase(sendSmsDelivery.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default customerSlice.reducer;
