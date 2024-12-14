import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { createNewInsuranceApi } from "@/services/admin/insurance/insurance.service";

// export const fetchAllBanks = createAsyncThunk(
//   "bank/fetchAllBank",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await getAllBankApi();
//       return data.allBanks;
//     } catch (error) {
//       const errors = error?.response?.data?.errors;
//       toast.error(errors.message);
//       return rejectWithValue(errors);
//     }
//   },
// );

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
// export const deleteBank = createAsyncThunk(
//   "bank/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       const data = await deleteBankById(id);
//       toast.success(data.message);
//       return id;
//     } catch (error) {
//       const errors = error?.response?.data?.errors;
//       toast.error(errors.message);
//       return rejectWithValue(errors);
//     }
//   },
// );

const insuranceSlice = createSlice({
  name: "insurance",
  initialState: {
    insuranceList: [],
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
      });
    // .addCase(deleteBank.fulfilled, (state, action) => {
    //   state.bankList = state.bankList.filter(
    //     (bank) => bank.BankId !== action.payload,
    //   );
    // });
  },
});

export default insuranceSlice.reducer;
