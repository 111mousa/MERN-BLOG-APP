import { useEffect, useState } from "react";
import "./create-post.css";
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import { createPost } from "../../redux/apiCalls/postApiCall";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const CreatePost = () => {

    const dispatch = useDispatch();
    const { categories } = useSelector(state=>state.category);
    const { loading,isPostCreated } = useSelector(state=>state.post);

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [category,setCategory] = useState("");
    const [file,setFile] = useState(null);

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        // to prevent submit click from doing reload to the page in web browser
        e.preventDefault();
        if(title.trim() === "") return toast.error("Post Titl is required");
        if(category.trim() === "") return toast.error("Post Category is required");
        if(description.trim() === "") return toast.error("Post Description is required");
        if(!file) return toast.error("Post Image is required");

        const formData = new FormData();
        formData.append("image",file);
        formData.append("title",title);
        formData.append("description",description);
        formData.append("category",category);

        dispatch(createPost(formData));
    }

    const navigate = useNavigate();

    useEffect(()=>{
        if(isPostCreated) navigate("/");
    },[isPostCreated,navigate]);

    useEffect(()=>{
        dispatch(fetchCategories());
    },[]);


    return ( 
        <section className="create-post">
            <h1 className="create-post-title">
                Create New Post
            </h1>
            <form onSubmit={formSubmitHandler} className="create-post-form">
                <input 
                type="text" 
                placeholder="Post Title"
                className="create-post-input"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                />
                <select
                value={category}
                onChange={(e)=>setCategory(e.target.value)} 
                className="create-post-input">
                    <option disabled value="">
                        Select A Category
                    </option>
                    {categories.map(category=> (
                        <option key={category?._id} value={category.title}>{category?.title}</option>
                    ))}
                </select>
                <textarea 
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                className="create-post-textarea"
                placeholder="Post Discription"
                rows={5}
                ></textarea>
                <input
                onChange={(e)=>setFile(e.target.files[0])} 
                type="file"
                name="file"
                id="file"
                className="create-post-upload"
                />
                <button type="submit"
                className="create-post-btn">
                    {loading?(
                        <RotatingLines
                            visible={true}
                            height="40"
                            width="40"
                            color="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            ariaLabel="rotating-lines-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    ):"Create"}
                </button>
            </form>
        </section>
    );
}

export default CreatePost