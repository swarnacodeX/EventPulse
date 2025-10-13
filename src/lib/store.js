// src/lib/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    isLoggedIn: false
  },
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.email = null;
      state.isLoggedIn = false;
    }
  }
});

export const { login, logout } = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});