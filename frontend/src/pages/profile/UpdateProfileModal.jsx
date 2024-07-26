import { useState } from "react";
import "./update-profile.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../../redux/apiCalls/profileApiCall";


const UpdateProfileModal = ({ setUpdateProfile,profile }) => {

    const [username,setUsername] = useState(profile.username);
    const [bio,setBio] = useState(profile.bio);
    const [password,setPassword] = useState("");
    const dispatch = useDispatch();

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        const updatedUser = {username,bio};
        if(password.trim() !== ""){
            updatedUser.password = password;
        }
        dispatch(updateProfile(profile?._id,updatedUser));
        setUpdateProfile(false);
    }

    return ( 
        <div className="update-profile">
            <form onSubmit={formSubmitHandler} className="update-profile-form">
                <abbr title="close">
                    <i onClick={()=>setUpdateProfile(false)} className="bi bi-x-circle-fill update-profile-form-close"></i>
                </abbr>
                <h1 className="update-profile-title">Update Your Profile</h1>
                <input type="text"
                value={username}
                placeholder="User Name"
                className="update-profile-input"
                onChange={(e)=>setUsername(e.target.value)}
                />
                <input type="text"
                value={bio}
                placeholder="Bio"
                className="update-profile-input"
                onChange={(e)=>setBio(e.target.value)}
                />
                <input type="password"
                value={password}
                placeholder="Password"
                className="update-profile-input"
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="update-profile-btn" type="submit">
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default UpdateProfileModal;