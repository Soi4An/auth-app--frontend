import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { LoginMethod } from '../../types/LoginMethod';

interface UserState {
  user: User | null;
  method: LoginMethod | null;
}

const initialState: UserState = {
  user: null,
  method: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserAndMethod: (state, action: PayloadAction<UserState>) => {
      const { user, method } = action.payload;
      state.user = user;
      state.method = method;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setMethod: (state, action: PayloadAction<LoginMethod>) => {
      state.method = action.payload;
    },
    clearAll: (state) => {
      state.user = null;
      state.method = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearMethod: (state) => {
      state.method = null;
    },
  },
});

export const {
  setUserAndMethod,
  setUser,
  setMethod,
  clearAll,
  clearUser,
  clearMethod,
} = userSlice.actions;

export default userSlice.reducer;
