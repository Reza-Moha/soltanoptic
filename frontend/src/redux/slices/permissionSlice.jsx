import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPermissionApi,
  createNewPermissionApi,
  updatePermissionApi,
  deletePermissionByIdApi,
} from "@/services/admin/permission/permission.service";
import toast from "react-hot-toast";

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchPermissions",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllPermissionApi();
      return data.allPermission;
    } catch (error) {
      const data = error?.response?.data?.errors;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

export const createPermission = createAsyncThunk(
  "permissions/createPermission",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewPermissionApi(values);
      toast.success(data.message);
      return data.permission;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/updatePermission",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const data = await updatePermissionApi(id, values);
      toast.success(data.message);
      return data.permission;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/deletePermission",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deletePermissionByIdApi(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const errors = error?.response?.data?.errors;
      toast.error(errors.message);
      return rejectWithValue(errors);
    }
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState: {
    permissionsList: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissionsList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPermission.fulfilled, (state, action) => {
        state.permissionsList.push(action.payload);
      })

      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissionsList.findIndex(
          (per) => per.permissionId === action.payload.permissionId
        );
        if (index !== -1) {
          state.permissionsList[index] = action.payload;
        }
      })

      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissionsList = state.permissionsList.filter(
          (per) => per.permissionId !== action.payload
        );
      });
  },
});

export default permissionSlice.reducer;
