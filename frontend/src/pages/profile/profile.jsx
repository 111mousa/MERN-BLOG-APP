import "./profile.css";
import "../../components/posts/PostList"
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import UpdateProfileModal from "./UpdateProfileModal";
import { useParams , useNavigate } from "react-router-dom";
import { deleteProfile, getUserProfile, uploadProfilePhoto } from "../../redux/apiCalls/profileApiCall";
import { Oval } from "react-loader-spinner";
import PostItem from "../../components/posts/PostItem";
import { logoutUser } from "../../redux/apiCalls/authApiCall";

const Profile = () => {

    const [file,setFile] = useState(null);
    const [updateProfile,setUpdateProfile] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();
    const { posts } = useSelector(state=>state.post);
    const { user } = useSelector(state=>state.auth);
    const { profile , loading , isProfileDeleted } = useSelector(state=>state.profile);

    useEffect(()=>{
        dispatch(getUserProfile(id));
        window.scrollTo(0,0);
    },[id]);

    const navigate = useNavigate();
    useEffect(()=>{
        if(isProfileDeleted){
            navigate("/");
        }
    },[navigate,isProfileDeleted]);

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(!file) return toast.warning("There is no file");
        const formData = new FormData();
        formData.append("image",file);
        dispatch(uploadProfilePhoto(formData));
        console.log("image uploaded");
    }

        // Delete Account Handler
        const deleteAccountHandler = (e) => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover profile!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((isOk) => {
                if (isOk) {
                    dispatch(deleteProfile(user?._id));
                    dispatch(logoutUser());
                }
            });
        }

        if(loading){
            return (
                <div className="profile-loader">
                    <Oval
                    visible={true}
                    height="120"
                    width="120"
                    color="#000"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    />
                </div>
                )
        }

    return ( 
        <section className="profile">
            <div className="profile-header">
                <div className="profile-image-wrapper">
                    <img 
                    src={file?URL.createObjectURL(file):profile?.profilePhoto?.url}
                    alt="" 
                    className="profile-image"
                    />
                    
                    {user?._id === profile?._id && (
                        <form onSubmit={formSubmitHandler}>
                        <abbr title="choose profile photo">
                            <label 
                            htmlFor="file" 
                            className="bi bi-camera-fill upload-profile-photo-icon"
                            ></label>
                        </abbr>
                        <input 
                        style={{display:"none"}} 
                        type="file" 
                        name="file" 
                        id="file" 
                        onChange={(e)=>setFile(e.target.files[0])}
                        />
                        <button type="submit" className="upload-profile-photo-btn">
                            Upload
                        </button>
                    </form>
                    )}
                </div>
                <h1 className="profile-username">{profile?.username}</h1>
                <p className="profile-bio">
                    {profile?.bio}
                </p>
                <div className="user-date-joined">
                    <strong>Date Joined : </strong>
                    <span>{new Date(profile?.createdAt).toDateString()}</span>
                </div>
                {user?._id === profile?._id && (
                    <button onClick={()=>setUpdateProfile(true)} className="profile-update-btn">
                        <i className="bi bi-file-person-fill"></i>
                        Update Profile
                    </button>
                )}
                
            </div>
            <div className="profile-posts-list">
                <h2 className="profile-posts-list-title">{profile?.username} Posts</h2>
                {profile?.posts?.map(post=>(
                    <PostItem 
                    key={post?._id} 
                    post={post}
                    username={profile?.username}
                    userId={profile?._d}
                    />
                ))}
            </div>
            {user?._id===profile?._id&&(
                <button onClick={deleteAccountHandler} className="delete-account-btn">
                    Delete Your Account
                </button>
            )}
            {updateProfile&&<UpdateProfileModal setUpdateProfile={setUpdateProfile} profile={profile}/>}
        </section>
    );
}

export default Profile;