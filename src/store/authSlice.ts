import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
import api, { refreshSession } from '../utils/axios';
import { clearAccessToken, setAccessToken } from '../auth/tokenStore';
import type { AdminUser, ApiEnvelope, AuthSessionData } from '../auth/authTypes';

/**
 * Auth state. The access token itself is NOT kept here — it lives only in
 * `auth/tokenStore` (memory). Redux only knows whether a session exists.
 */
interface AuthState {
    user: AdminUser | null;
    isAuthenticated: boolean;
    /** True until the boot-time POST /auth/refresh has settled. */
    isBootstrapping: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isBootstrapping: true,
    isLoading: false,
    error: null,
};

function extractErrorMessage(err: unknown, fallback: string): string {
    if (isAxiosError<{ message?: string }>(err)) {
        return err.response?.data?.message || fallback;
    }
    return fallback;
}

/** Boot-time session restore from the HttpOnly refresh cookie. */
export const restoreSession = createAsyncThunk<AdminUser, void, { rejectValue: null }>(
    'auth/restoreSession',
    async (_, { rejectWithValue }) => {
        const session = await refreshSession();
        return session ? session.user : rejectWithValue(null);
    }
);

export const loginUser = createAsyncThunk<AdminUser, LoginCredentials, { rejectValue: string }>(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post<ApiEnvelope<AuthSessionData>>('/auth/login', credentials);
            if (response.data.success && response.data.data?.token) {
                setAccessToken(response.data.data.token);
                return response.data.data.user;
            }
            return rejectWithValue(response.data.message || 'Login failed');
        } catch (err: unknown) {
            return rejectWithValue(extractErrorMessage(err, 'Login failed'));
        }
    }
);

/** Revokes the server session (clears the refresh cookie), then forgets the access token. */
export const logoutUser = createAsyncThunk<void, void>('auth/logoutUser', async () => {
    try {
        await api.post('/auth/logout');
    } catch (err: unknown) {
        console.error('Logout request failed; clearing local session anyway', err);
    } finally {
        clearAccessToken();
    }
});

export const fetchMe = createAsyncThunk<AdminUser, void, { rejectValue: string }>(
    'auth/fetchMe',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<ApiEnvelope<AdminUser>>('/admin/profile/details');
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue(response.data.message || 'Failed to fetch user');
        } catch (err: unknown) {
            return rejectWithValue(extractErrorMessage(err, 'Failed to fetch user'));
        }
    }
);

function resetSession(state: AuthState): void {
    state.user = null;
    state.isAuthenticated = false;
    state.isLoading = false;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /** Local-only clear, used when the refresh flow fails (session expired/revoked). */
        sessionCleared: (state) => {
            resetSession(state);
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUserData: (state, action: PayloadAction<Partial<AdminUser>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.isBootstrapping = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(restoreSession.rejected, (state) => {
                state.isBootstrapping = false;
                resetSession(state);
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload ?? 'Login failed';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                resetSession(state);
            })
            .addCase(logoutUser.rejected, (state) => {
                resetSession(state);
            })
            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const { sessionCleared, clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer;
