import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    userInfo: null
};

// Attempt to load userInfo from localStorage safely
try {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        initialState.userInfo = JSON.parse(storedUserInfo); // Parse only if it's valid JSON
    }
} catch (error) {
    console.error('Failed to parse userInfo from localStorage:', error);
    localStorage.removeItem('userInfo'); // Remove the corrupted item if any parsing errors occur
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
