import {useParams} from "react-router-dom";
import "./category.css";
import { Link } from "react-router-dom";
import PostList from "../../components/posts/PostList";
import { useDispatch,useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPostsBasedOnCategory } from "../../redux/apiCalls/postApiCall";

const Category = () => {
    const dispatch = useDispatch();
    const { postsCategories } = useSelector(state=>state.post);
    const { category } = useParams();

    useEffect(()=>{
        dispatch(fetchPostsBasedOnCategory(category));
        window.scrollTo(0,0);
    },[category]);

    return ( 
        <section className="category">
            {postsCategories.length === 0 ? 
            (
                <>
                    <h1 className="category-not-found">
                        Posts With <span>{category}</span> Category Not Found
                    </h1>
                    <Link to={"/posts"} className="category-not-found-link">
                        Go To Posts Page
                    </Link>
                </>
            ):
            (
            <>
            <h1 className="category-title">Posts based on {category}</h1>
                <PostList posts={postsCategories}/>
            </>
            )
            }
            
        </section>
    );
}

export default Category;