import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") ? JSON.parse(localStorage.getItem('isLoggedIn')) : false,
}

export const googleLogin = createAsyncThunk("auth/googleLogin", async (tokenId) => {
    try {
        console.log("tokenId in thunk :", tokenId);

        const res = await toast.promise(
            axiosInstance.post("/user/google/auth", tokenId, { withCredentials: true }),
            {
                loading: "Logging in to account...",
                success: "Logged in successfully!",
                error: "Login failed!",
            }
        );

        console.log("data in thunk :", res.data);
        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login");
        throw error;
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(googleLogin.fulfilled, (state, action) => {
                if (action?.payload) {
                    state.isLoggedIn = true;
                    console.log("bro here action.payload.data ", action.payload.data.name);
                    localStorage.setItem('isLoggedIn', true);
                }
            })
    }
});

export default authSlice.reducer;