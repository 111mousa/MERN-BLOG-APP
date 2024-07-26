import "./add-comment.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createComment } from "../../redux/apiCalls/commentApiCall";

const AddComment = ({ postId }) => {

    const [text,setText] = useState("");
    const dispatch = useDispatch();

    //Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(text.trim() === "") return toast.error("Please Write Something");
        dispatch(createComment({text,postId}));
        setText("");
    }

    return ( 
        <form onSubmit={formSubmitHandler} className="add-comment">
            <input type="text"
            placeholder="Add A Comment"
            className="add-comment-input"
            value={text}
            onChange={(e)=>setText(e.target.value)}
            />
            <button className="add-comment-btn" type="submit"> Comment </button>
        </form>
    );
}

export default AddComment;