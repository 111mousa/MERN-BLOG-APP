import { useEffect, useState } from "react";
import "./update-post.css";
import { useDispatch , useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updatePost } from "../../redux/apiCalls/postApiCall";
import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const UpdatePostModal = ({ setUpdatePost,post }) => {

    const dispatch = useDispatch();
    const { categories } = useSelector(state=>state.category);
    const [title,setTitle] = useState(post?.title);
    const [description,setDescription] = useState(post?.description);
    const [category,setCategory] = useState(post?.category);

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(title.trim() === "") return toast.error("Post Titl is required");
        if(category.trim() === "") return toast.error("Post Category is required");
        if(description.trim() === "") return toast.error("Post Description is required");
        
        dispatch(updatePost({title,category,description},post?._id));
        setUpdatePost(false);

    }

    useEffect(()=>{
        dispatch(fetchCategories());
    },[]);

    return ( 
        <div className="update-post">
            <form onSubmit={formSubmitHandler} className="update-post-form">
                <abbr title="close">
                    <i onClick={()=>setUpdatePost(false)} className="bi bi-x-circle-fill update-post-form-close"></i>
                </abbr>
                <h1 className="update-post-title">Update Post</h1>
                <input type="text"
                value={title}
                className="update-post-input"
                onChange={(e)=>setTitle(e.target.value)}
                />
                <select className="update-post-input">
                    <option 
                    value={category}
                    disabled
                    onChange={(e)=>setCategory(e.target.value)}
                    >Select A Category</option>
                    {categories?.map(category=>(
                        <option key={category?._id} value={category?.title} >{category?.title}</option>
                    ))}
                </select>
                <textarea 
                className="update-post-textarea"
                rows={5}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                ></textarea>
                <button className="update-post-btn" type="submit">
                    Update Post
                </button>
            </form>
        </div>
    );
}

export default UpdatePostModal;