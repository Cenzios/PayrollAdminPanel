import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/axios';
import { User } from '../types';

interface UserState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    totalUsers: number;
    selectedUser: any | null;
}

const initialState: UserState = {
    users: [],
    isLoading: false,
    error: null,
    totalUsers: 0,
    selectedUser: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to fetch users');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const sendUserNotification = createAsyncThunk(
    'users/sendNotification',
    async ({ userId, title, message }: { userId: string; title: string; message: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/notifications/send', { userId, title, message });
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to send notification');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to send notification');
        }
    }
);

export const fetchUserDetails = createAsyncThunk(
    'users/fetchUserDetails',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/users/${userId}`);
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to fetch user details');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch user details');
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.totalUsers = action.payload.pagination.total;
            })
            .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserDetails.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserDetails.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
