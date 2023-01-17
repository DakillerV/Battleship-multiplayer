// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
const cookies = new Cookies();


const config = {
  tokenType: "Bearer",

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",
};

const initialUser = () => {
  const item = cookies.get("userData");
  //** Parse stored json or if none return initialValue
  return item;
};

export const authSlice = createSlice({
  name: "authentication",
  initialState: {
    userData: initialUser(),
  },
  reducers: {
    handleLogin: (state, action) => {
      console.log(
        "%c [Log]" +
          "%c[Auth]" +
          `%c Logged In ${action.payload.userData.name} | ${action.payload.userData.id}`,
        "color: #99A1A6",
        "color: #C1292E",
        "color: #99A1A6"
      );
      state.userData = action.payload;
      state[config.storageTokenKeyName] =
        action.payload[config.storageTokenKeyName];
      state[config.storageRefreshTokenKeyName] =
        action.payload[config.storageRefreshTokenKeyName];
      cookies.set("userData", `${JSON.stringify(action.payload)}`, {
        path: "/",
      });
      cookies.set(
        config.storageTokenKeyName,
        JSON.stringify(action.payload.accessToken),
        { path: "/" }
      );
      cookies.set(
        config.storageRefreshTokenKeyName,
        JSON.stringify(action.payload.refreshToken),
        { path: "/" }
      );
    },
    handleLogout: (state) => {
      state.userData = {};
      state[config.storageTokenKeyName] = null;
      state[config.storageRefreshTokenKeyName] = null;
      const cookies2 = cookies.getAll();
      for (const property in cookies2) {
        cookies.remove(`${property}`);
      }
    },
  },
});

export const { handleLogin, handleLogout } = authSlice.actions;

export default authSlice.reducer;
