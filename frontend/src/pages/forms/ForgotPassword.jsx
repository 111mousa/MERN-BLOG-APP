import "./form.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { forgotPassword } from "../../redux/apiCalls/passwordApiCall";

const ForgotPassword = () => {

    const dispatch = useDispatch();
    const [email,setEmail] = useState("")

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault();
        if(email.trim() === "") return toast.error("Email is required");
        dispatch(forgotPassword(email));
    }


    return ( 
        <section className="form-container">
            <h1 className="form-title">Forgot Password</h1>
            <form onSubmit={formSubmitHandler} className="form">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input 
                    type="email" 
                    className="form-input"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    />
                </div>
                <button className="form-btn" type="submit">Submit</button>
            </form>
        </section>
    );
}

export default ForgotPassword;