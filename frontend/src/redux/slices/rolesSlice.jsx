import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createNewRoleApi,
  getAllRolesApi,
  deleteRoleByIdApi,
  updateRolesApi,
} from "@/services/admin/permission/permission.service";
import toast from "react-hot-toast";

export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllRolesApi();
      return data.allRoles;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

export const createNewRole = createAsyncThunk(
  "role/createRole",
  async (values, { rejectWithValue }) => {
    try {
      const data = await createNewRoleApi(values);
      toast.success(data.message);
      return data.createdRole;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async ({ id, values }, { rejectWithValue }) => {
    try {
      const data = await updateRolesApi(id, values);
      toast.success(data.message);
      return data.updatedRole;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteRoleByIdApi(id);
      toast.success(data.message);
      return id;
    } catch (error) {
      const data = error?.response?.data;
      toast.error(data.message);
      return rejectWithValue(data);
    }
  }
);

const rolesSlice = createSlice({
  name: "role",
  initialState: {
    rolesList: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.rolesList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createNewRole.fulfilled, (state, action) => {
        state.rolesList.push(action.payload);
      })

      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.rolesList.findIndex(
          (role) => role.id === action.payload.id
        );
        if (index !== -1) {
          state.rolesList[index] = action.payload;
        }
      })

      .addCase(deleteRole.fulfilled, (state, action) => {
        state.rolesList = state.rolesList.filter(
          (role) => role.roleId !== action.payload
        );
      });
  },
});

export default rolesSlice.reducer;
