import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../utils/axios';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalCompanies: number;
  totalEmployees: number;
  monthlyRevenue: number;
  suspiciousLogins: number;
}

interface ChartDataPoint {
  month: string;
  value: number;
}

interface DashboardState {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  userRole: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    activeSubscriptions: 0,
    totalCompanies: 0,
    totalEmployees: 0,
    monthlyRevenue: 0,
    suspiciousLogins: 0,
  },
  chartData: [],
  userRole: 'System Administrator',
  isLoading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard/summary');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch stats');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    updateChartData: (state, action: PayloadAction<ChartDataPoint[]>) => {
      state.chartData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.stats = {
          totalUsers: action.payload.totalUsers,
          activeSubscriptions: action.payload.activeSubscriptions,
          totalCompanies: action.payload.totalCompanies,
          totalEmployees: action.payload.totalEmployees,
          monthlyRevenue: action.payload.monthlyRevenue,
          suspiciousLogins: action.payload.suspiciousLogins,
        };
        state.chartData = action.payload.chartData;
      })
      .addCase(fetchDashboardStats.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateStats, updateChartData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
