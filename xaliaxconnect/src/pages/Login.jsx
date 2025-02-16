import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Dashboard from './Dashboard';
import axios from "axios";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    
    const navigate = useNavigate();


  {/* const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:4002/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login Successful");
                setUser(data.user); // Store user info
                navigate("/admindashboard", { state: { user: data.user } }); // Pass user to dashboard
            } else {
                alert(data.message); // Show error message
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Server error, please try again later");
        }
    }; */} 

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:4002/login", {
                email,
                password,
            });
    
            alert("Login Successful");
            setUser(response.data.user); // Store user info
            navigate("/admindashboard", { state: { user: response.data.user } }); // Pass user to dashboard
        } catch (error) {
            console.error("Error during login:", error);
            if (error.response) {
                alert(error.response.data.message); // Show error message from server
            } else {
                alert("Server error, please try again later");
            }
        }
    };


    
  return (
   <div className='continer'>
    <div className='row'>
    <div className='col-md-4 col-sm-8'>
</div>

    <div className='col-md-4 col-sm-8'>
        <div className='loginpage'>
        <h3 className='login-page-heading'>Xaliax Connect </h3>
        <h6 className='login-page-heading'>Login</h6>
        <div style={{textAlign:'center'}}>
        <img src="./src/assets/icons-logo.jpg"  class="img-fluid mb-3"  style={{height:'120px'}} />
        </div>
        <div>
        <label className='form-label'>Email</label>
        </div>
        <input className='form-control' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <div>
        <label className='form-label'>Password</label>
        </div>
        <input className='form-control' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <div style={{marginTop:'15px'}}>
            <button className='btn btn-danger w-100' onClick={handleLogin}>Login</button>
        </div>
        <div style={{marginTop:'15px', textAlign:'center'}}>
            <button onClick={() =>  navigate('/singup')} >Don't have an account? <span style={{fontWeight:'bold', color: '#3f964f'}}>Sign Up</span></button>
            </div>
        </div>
     
    </div>
    <div className='col-md-4 col-sm-8'>
    </div>
    </div>
   </div>
  )
}

export default Login
