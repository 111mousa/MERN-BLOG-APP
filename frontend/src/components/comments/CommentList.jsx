import { useState } from "react";
import "./comment-list.css";
import swal from "sweetalert";
import { useDispatch,useSelector } from "react-redux";
import Moment from "react-moment";
import UpdateCommentModal from "./UpdateCommentModal";
import { deleteComment } from "../../redux/apiCalls/commentApiCall";

const CommentList = ({ comments }) => {

    const { user } = useSelector(state=>state.auth);
    const [commentForUpdate,setCommentForUpdate] = useState(null);
    const [updateComment,setUpdateComment] = useState(false);
    const dispatch = useDispatch();

    // Delete Comment Handler
    const deleteCommentHandler = (commentId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this comment!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((isOk) => {
            if (isOk) {
                dispatch(deleteComment(commentId));
            }
        });
    }

    const updateCommentHandler = (comment)=>{
        setCommentForUpdate(comment);
        setUpdateComment(true);
    }

    return ( 
        <div className="comment-list">
            <h4 className="comment-list-count">
                {comments?.length} Comments
            </h4>
            {comments?.map(comment=>(
                <div key={comment?._id} className="comment-item">
                    <div className="comment-item-info">
                        <div className="comment-item-username">{comment.username}</div>
                        <div className="comment-item-time">
                            <Moment fromNow ago>
                                {comment?.createdAt}
                            </Moment>{" "}ago
                        </div>
                    </div>
                    <p className="comment-item-text">
                        {comment?.text}
                    </p>
                    {user?._id === comment?.user&&(
                        <div className="comment-item-icon-wrapper">
                            <i onClick={()=>updateCommentHandler(comment)} className="bi bi-pencil-square"></i>
                            <i onClick={() => deleteCommentHandler(comment?._id)} className="bi bi-trash-fill"></i>
                        </div>
                    )}
                </div>
            ))}
            {updateComment&&<UpdateCommentModal commentForUpdate={commentForUpdate} setUpdateComment={setUpdateComment}/>}
        </div>
    );
}

export default CommentList;