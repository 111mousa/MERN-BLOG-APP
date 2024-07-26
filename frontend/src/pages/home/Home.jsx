import PostList from "../../components/posts/PostList";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts } from "../../redux/apiCalls/postApiCall";
import { useDispatch,useSelector } from "react-redux";
import "./home.css";

const Home = () => {
    const dispatch = useDispatch();
    const { posts } = useSelector(state=>state.post);
    useEffect(()=>{
        dispatch(fetchPosts(1));
    },[]);

    return ( 
        <section className="home">
            <div className="home-hero-header">
                <div className="home-hero-header-layout">
                    <h1 className="home-title">
                        Welcom To Blog
                    </h1>
                </div>
            </div>
            <div className="home-latest-post">
                Latest Posts
            </div>
            <div className="home-container">
                <PostList posts={posts}/>
                <Sidebar />
            </div>
            <div className="home-see-posts-link">
                <Link to="posts" className="home-link">
                    See All Posts
                </Link>
            </div>
        </section>
    );
}

export default Home;