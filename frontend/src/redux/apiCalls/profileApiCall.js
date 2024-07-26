import { profileAction } from "../slices/profileSlice";
import request from "../../../src/utils/request";
import { toast } from "react-toastify";
import { authAction } from "../slices/authSlice";


// Get User Profile
export function getUserProfile(userId){
    return async (dispatch) => {
        try {
            const { data } = await request.get(`/api/users/profile/${userId}`);
            dispatch(profileAction.setProfile(data));
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
}

// Upload Profile Photo
export function uploadProfilePhoto(newPhoto){
    // getState : its a function that give me all the states that i have in the store
    return async (dispatch,getState) => {
        try{
            const { data } = await request.post(`/api/users/profile/profile-photo-upload`,newPhoto ,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                    "Content-Type" : "multipart/form-data",
                }
            });
            dispatch(profileAction.setProfilePhoto(data?.profilePhoto));
            dispatch(authAction.setUserPhoto(data?.profilePhoto));
            toast.success(data.message);
            // modify the user in local storage with new photo
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (user) {
                user.profilePhoto = data?.profilePhoto;
                localStorage.setItem("userInfo", JSON.stringify(user));
            }else{
                toast.error("error in the user");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.log(error);
        }
    }
}

// Update Profile
export function updateProfile(userId,profile){
    // getState : its a function that give me all the states that i have in the store
    return async (dispatch,getState) => {
        try{
            const { data } = await request.put(`/api/users/profile/${userId}`,profile ,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                }
            });
            dispatch(profileAction.updateProfile(data));
            dispatch(authAction.setUserPhoto(data?.username));
            // modify the user in local storage with new username
            const user = JSON.parse(localStorage.getItem("userInfo"));
            if (user) {
                user.username = data?.username;
                localStorage.setItem("userInfo", JSON.stringify(user));
            }else{
                toast.error("error in the user");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred";
            toast.error(errorMessage);
            console.log(error);
        }
    }
}

// Delete Profile (Account)
export function deleteProfile(userId){
    // getState : its a function that give me all the states that i have in the store
    console.log(userId);
    return async (dispatch,getState) => {
        try{
            dispatch(profileAction.setLoading());
            console.log(getState().auth.user.token);
            console.log(getState().auth.user?._id);

            const { data } = await request.delete(`/api/users/profile/${userId}`,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                },
            });
            
            dispatch(profileAction.setIsProfileDeleted());
            toast.success(data?.message);
            setTimeout(() => {
                dispatch(profileAction.clearIsProfileDeleted());
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
            dispatch(profileAction.clearLoading());
        }
    }
}

// Get Users Count (For Admin Dashboard)
export function getUsersCount(){
    // getState : its a function that give me all the states that i have in the store
    return async (dispatch,getState) => {
        try{
            const { data } = await request.get(`/api/users/count`,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                },
            });

            dispatch(profileAction.setUsersCount(data));

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
}

// Get All Users Profile (For Admin Dashboard)
export function getAllUsersProfile(){
    // getState : its a function that give me all the states that i have in the store
    return async (dispatch,getState) => {
        try{
            const { data } = await request.get(`/api/users/profile`,{
                headers: {
                    Authorization: "Bearer " + getState().auth.user.token,
                },
            });

            dispatch(profileAction.setProfiles(data));

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
}