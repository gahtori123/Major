import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") ? JSON.parse(localStorage.getItem('isLoggedIn')) : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
    chatList: [],
    selectedChat: null,
    status: "idle",
    error: null,
    messagesData: [],
    searchData:[],
}

export const googleLogin = createAsyncThunk("auth/googleLogin", async (tokenId) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/google/auth", tokenId, { withCredentials: true }),
            {
                loading: "Logging in to account...",
                success: "Logged in successfully!",
                error: "Login failed!",
            }
        );

        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login");
        throw error;
    }
});

export const AddContactIn = createAsyncThunk("auth/AddContact", async ({ email, name, id }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/createContactList", { email, user_id:id,name }, { withCredentials: true }),
            {
                loading: "Adding contact...",
                success: "Added contact successfully!",
                error: "Failed to add contact!",
            }
        );

        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login");
        throw error;
    }
})

export const fetchChats = createAsyncThunk("auth/chatList", async (userId) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/fetchChats", { userId }, { withCredentials: true }),
            {
                loading: "Fetching chats...",
                success: "Fetched chats successfully!",
                error: "Failed to fetch chats!",
            }
        );

        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login");
        throw error;
    }
})

export const searchBarContent =  createAsyncThunk("auth/searchBarContent", async ({ userId, content }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/search", { userId, content }, { withCredentials: true }),
            {
                loading: "Searching...",
                success: "Searched successfully!",
                error: "Failed to search!",
            }
        );

        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while searching");
        throw error;
    }
})
export const selectChat = createAsyncThunk("auth/selectChat", async ({ chat_id, userId}) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/getMessages", { chat_id, userId }, { withCredentials: true }),
            {
                loading: "Selecting chat...",
                success: "Selected chat successfully!",
                error: "Failed to select chat!",
            }
        );

        return res;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred while selecting chat");
        throw error;
    }
})

export const createChat = createAsyncThunk("auth/createChat", async ({ userId, users }) => {
    try
    {
        console.log("users",users)
        const res = await toast.promise(
            axiosInstance.post("/user/createChat", { initiator_id:userId,user_id_array: users }, { withCredentials: true }),
            {
                loading: "Creating chat...",
                success: "Created chat successfully!",
                error: "Failed to create chat!",
            }
        );

        return res.data;
    }catch(error){
        toast.error(error.response?.data?.message || "an error occurred while initiating chat");
        throw error;
    }
})

export const sendMessage = createAsyncThunk("auth/sendMessage", async ({ sender_user_id, chat_id, message }) => {
    try {
        const res = await toast.promise(
            axiosInstance.post("/user/sendMessage", { sender_user_id, chat_id, message }, { withCredentials: true }),
            {
                loading: "Sending message...",
                success: "Sent message successfully!",
                error: "Failed to send message!",
            }
        );

        return res.data;
    } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred during login");
        throw error;
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearSearchData:(state)=>{
            state.searchData=[]
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(googleLogin.fulfilled, (state, action) => {
                if (action?.payload) {
                    state.isLoggedIn = true;
                    state.user = action?.payload?.data;
                    localStorage.setItem('user', JSON.stringify(action?.payload?.data));
                    localStorage.setItem('isLoggedIn', true);
                }
            })

            .addCase(fetchChats.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.chatList = action.payload.data || [];
            })

            .addCase(fetchChats.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            .addCase(selectChat.fulfilled, (state, action) => {
                state.selectedChat = action.payload.data.chatData;
                state.messagesData = action.payload.data.data;
            })

            .addCase(sendMessage.fulfilled, (state, action) => {

                state.chatList = state.chatList.map((chat) => {
                    if (chat._id === action.meta.arg.chat_id) {
                        return {
                            ...chat,
                            lastMessage: {
                                message: action.payload.data.message,
                                timestamp: action.payload.data.timestamp,
                                senderId: action.payload.data.sender_user_id._id,
                            },
                        };
                    }
                    return chat;
                });

                state.messagesData.push(action.payload.data);
            })

            .addCase(searchBarContent.fulfilled, (state, action) => {
                state.searchData = action.payload.data;
                console.log("search data", state.searchData);
            })
    }
});
export const{clearSearchData} = authSlice.actions
export default authSlice.reducer;