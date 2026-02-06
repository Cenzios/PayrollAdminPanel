import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/axios';
import { Company } from '../types';

interface CompanyState {
    companies: Company[];
    isLoading: boolean;
    error: string | null;
    totalCompanies: number;
}

const initialState: CompanyState = {
    companies: [],
    isLoading: false,
    error: null,
    totalCompanies: 0,
};

export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/companies?page=${page}&limit=${limit}&search=${search}`);
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to fetch companies');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch companies');
        }
    }
);

const companySlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        clearCompanyError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.companies = action.payload.companies;
                state.totalCompanies = action.payload.pagination.total;
            })
            .addCase(fetchCompanies.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCompanyError } = companySlice.actions;
export default companySlice.reducer;
