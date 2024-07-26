import {Link,useParams} from "react-router-dom";
import "./form.css";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getResetPassword, resetPassword } from "../../redux/apiCalls/passwordApiCall";

const ResetPassword = () => {

    const dispatch = useDispatch();
    const { userId , token } = useParams();
    const { isError } = useSelector(state=>state.password);

    const [password,setPassword] = useState("")

    useEffect(()=>{
        dispatch(getResetPassword(userId,token));
    },[userId,token]);

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(password.trim() === "") return toast.error("Password is required");
        dispatch(resetPassword(password,{ userId , token }));
    }


    return ( 
        <section className="form-container">
            {isError
            ?<><h1>Not Found</h1></>
            :<>
                <h1 className="form-title">Reset Password</h1>
                <form onSubmit={formSubmitHandler} className="form">
                    <div className="form-group">
                        <label htmlFor="password"
                        className="form-label"
                        >
                            New Password
                        </label>
                        <input 
                        type="password" 
                        className="form-input"
                        id="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="Enter Your New Password"
                        />
                    </div>
                    <button className="form-btn" type="submit">Reset</button>
                </form>
            </>}
        </section>
    );
}

export default ResetPassword;