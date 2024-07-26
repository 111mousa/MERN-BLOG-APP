import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { useDispatch,useSelector } from "react-redux";
import "./admin-table.css";
import { useEffect } from "react";
import { fetchAllPosts,deletePost } from "../../redux/apiCalls/postApiCall";


const PostsTable = () => {

    const dispatch = useDispatch();
    const { posts } = useSelector(state=>state.post);

    useEffect(()=>{
        dispatch(fetchAllPosts());
    },[]);

    // Delete Post Handler
    const deletePostHandler = (postId) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                dispatch(deletePost(postId));
            }
        });
    }

    return ( 
        <section className="table-container">
            <AdminSidebar/>
            <div className="table-wrapper">
                <h1 className="table-title">Posts</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Count</th>
                            <th>User</th>
                            <th>Post Title</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts?.map((post,index)=>(
                            <tr key={post._id}>
                                <td>{index+1}</td>
                                <td>
                                    <div className="table-image">
                                        <img 
                                        src={post?.user?.profilePhoto?.url} 
                                        alt=""
                                        className="table-user-image"
                                        />
                                        <span className="table-username">{post?.user?.username}</span>
                                    </div>
                                </td>
                                <td>{post?.title}</td>
                                <td>
                                    <div className="table-button-group">
                                        <button>
                                            <Link to={`/posts/details/${post?._id}`}>
                                                View Post
                                            </Link>
                                        </button>
                                        <button onClick={() => deletePostHandler(post?._id)}>
                                            Delete Post
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default PostsTable;