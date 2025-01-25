import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewDoctorApi,
  deleteDoctorById,
  getAllDoctorsApi,
  updateDoctorsApi,
} from "@/services/admin/doctor/doctor.service";
import toast from "react-hot-toast";

export const fetchAllDoctors = createAsyncThunk(
  "doctor/fetchAllDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllDoctorsApi();
      return data.doctors;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

export const createNewDoctor = createAsyncThunk(
  "doctor/createNewDoctor",
  async (values, { rejectWithValue }) => {
    try {
      const visitPriceWithoutComma = values.visitPrice.replace(/,/g, "");
      const dataToSubmit = {
        ...values,
        visitPrice: +visitPriceWithoutComma,
      };
      const data = await createNewDoctorApi(dataToSubmit);
      toast.success(data.message);
      return data.createdNewDoctor;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);
export const updateDoctor = createAsyncThunk(
  "doctor/updateDoctor",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const data = await updateDoctorsApi(id, values);
      toast.success(data.message);
      return data.updatedDoctor;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  }
);
export const deleteDoctor = createAsyncThunk(
  "doctor/deleteDoctor",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteDoctorById(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctor",
  initialState: {
    doctorsList: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDoctors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctorsList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createNewDoctor.fulfilled, (state, action) => {
        state.doctorsList.push(action.payload);
      })

      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.doctorsList = state.doctorsList.filter(
          (doc) => doc.doctorId !== action.payload
        );
      })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        const index = state.doctorsList.findIndex(
          (doc) => doc.doctorId === action.payload.doctorId
        );
        if (index !== -1) {
          state.doctorsList[index] = action.payload;
        }
      });
  },
});

export default doctorsSlice.reducer;
