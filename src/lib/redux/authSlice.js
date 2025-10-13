import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    password: "",
    isLoggedIn: false,
    role:""
  },
  reducers: {
    setCredentials: (state, action) => {
      const { email, password, isLoggedIn ,role} = action.payload;
      state.email = email;
      state.password = password;
      state.isLoggedIn = isLoggedIn;
      state.role=role;
    },
    clearCredentials: (state) => {
      state.email = "";
      state.password = "";
      state.isLoggedIn = false;
      state.role="";
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
