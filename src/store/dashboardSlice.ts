import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalCompanies: number;
  totalCompaniesChange: number;
  monthlyIncome: number;
  monthlyIncomeChange: number;
  expiredCompanies: number;
  expiredCompaniesChange: number;
  totalIncome: number;
  totalIncomeChange: number;
}

interface ChartDataPoint {
  month: string;
  value: number;
}

interface DashboardState {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  userRole: string;
}

const initialState: DashboardState = {
  stats: {
    totalCompanies: 5420,
    totalCompaniesChange: 55,
    monthlyIncome: 300098,
    monthlyIncomeChange: 2.5,
    expiredCompanies: 123,
    expiredCompaniesChange: -20,
    totalIncome: 123,
    totalIncomeChange: 2.5,
  },
  chartData: [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1900 },
    { month: 'Mar', value: 2800 },
    { month: 'Apr', value: 3100 },
    { month: 'May', value: 3400 },
    { month: 'Jun', value: 3800 },
    { month: 'Jul', value: 4200 },
    { month: 'Aug', value: 4600 },
    { month: 'Sep', value: 4800 },
    { month: 'Oct', value: 5100 },
    { month: 'Nov', value: 5200 },
    { month: 'Dec', value: 5300 },
  ],
  userRole: 'System Administrator',
};

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
});

export const { updateStats, updateChartData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
