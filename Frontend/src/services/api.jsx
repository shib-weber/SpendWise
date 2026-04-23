import axios from 'axios';

const API_BASE_URL = 'https://spendwise-nmhf.onrender.com';

// Create an axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * AXIOS INTERCEPTOR
 * Injects the JWT token into the Authorization header.
 * Also handles 401 errors globally to clear stale tokens.
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional: Add a response interceptor to handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optional: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export const api = {
  // --- AUTHENTICATION ---
  sendOtp: (email) => API.post('/auth/send-otp', null, { params: { email } }),
  
  verifyOtp: (email, otp) => API.post('/auth/verify', null, { 
    params: { email, otp } 
  }),

  // --- ACCOUNTS ---
  getAccounts: () => API.get('/accounts/'),
  
  addAccount: (data) => API.post('/accounts/', data),

  // --- TRANSACTIONS (Expenses & Income) ---
  getExpenses: (date) => API.get(`/expenses/${date}`),
  
  /**
   * adds a new transaction. 
   * @param {Object} data - includes title, amount, category, account_id, date, and type ('income'|'expense')
   */
  addExpense: (data) => API.post('/expenses/', data),
  deleteExpense: (id) => API.delete(`/expenses/${id}`),
  getAllExpenses: () => API.get('/expenses-all'),
  deleteAccount: (id) => API.delete(`/accounts/${id}`),
};

export default api;