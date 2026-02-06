import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/axios';

interface SettingsState {
    isLoading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialState: SettingsState = {
    isLoading: false,
    error: null,
    successMessage: null,
};

export const updateProfile = createAsyncThunk(
    'settings/updateProfile',
    async (data: { fullName: string; email: string }, { rejectWithValue }) => {
        try {
            const response = await api.patch('/admin/profile/update', data);
            if (response.data.success) {
                return response.data;
            }
            return rejectWithValue(response.data.message);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const changePassword = createAsyncThunk(
    'settings/changePassword',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/profile/change-password', data);
            if (response.data.success) {
                return response.data;
            }
            return rejectWithValue(response.data.message);
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to change password');
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        clearStatus: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Change Password
            .addCase(changePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(changePassword.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
            })
            .addCase(changePassword.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearStatus } = settingsSlice.actions;
export default settingsSlice.reducer;
