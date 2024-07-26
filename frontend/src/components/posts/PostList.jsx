import PostItem from "./PostItem";
import "./posts.css";

const PostList = ({ posts }) => {
    return ( 
        <div className="posts-list">
            {posts.map(item => <PostItem post={item} key={item._id}/>)}
        </div>
    );
}

export default PostList;