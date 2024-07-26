import { useState } from "react";
import "./update-comment.css";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateComment } from "../../redux/apiCalls/commentApiCall";

const UpdateCommentModal = ({ setUpdateComment , commentForUpdate }) => {

    const [text,setText] = useState(commentForUpdate?.text);
    const dispatch = useDispatch();
    

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(text.trim() === "") return toast.error("PLease write something");

        dispatch(updateComment(commentForUpdate?._id,{text}));
        setUpdateComment(false);
    }

    return ( 
        <div className="update-comment">
            <form onSubmit={formSubmitHandler} className="update-comment-form">
                <abbr title="close">
                    <i onClick={()=>setUpdateComment(false)} className="bi bi-x-circle-fill update-comment-form-close"></i>
                </abbr>
                <h1 className="update-comment-title">Edit Comment</h1>
                <input type="text"
                value={text}
                className="update-comment-input"
                onChange={(e)=>setText(e.target.value)}
                />
                <button className="update-comment-btn" type="submit">
                    Edit Comment
                </button>
            </form>
        </div>
    );
}

export default UpdateCommentModal;