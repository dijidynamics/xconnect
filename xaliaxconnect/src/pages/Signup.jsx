import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");  
    const [error, setError] = useState("");

    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEmail(inputValue);

        // Validation: Allow only emails ending with @gmail.com
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(inputValue)) {
            setError("Please enter a valid Gmail address.");
        } else {
            setError("");
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async () => {
        // Validate required fields
        if (!email || !password || !username) {
            window.alert("All fields are required!");
            return;
        }
    
        // Validate Gmail address format
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
            window.alert("Please enter a valid Gmail address.");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost:4002/addsampleusers", {
                email,
                password,
                username,
            });
    
            // Show success message and redirect if needed
            window.alert(response.data.message);
            navigate("/"); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Error submitting form:", error);
    
            // Handle server errors properly
            if (error.response) {
                window.alert(error.response.data.message || "Failed to register user");
            } else {
                window.alert("Server error, please try again.");
            }
        }
    };
    

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-4 col-sm-8'></div>

                <div className='col-md-4 col-sm-8'>
                    <div className='loginpage'>
                        <h3 className='login-page-heading'>Xaliax Connect</h3>
                        <h6 className='login-page-heading'>New Register</h6>
                        <div style={{ textAlign: 'center' }}>
                            <img src="./src/assets/icons-logo.jpg" className="img-fluid mb-3" style={{ height: '120px' }} alt="logo"/>
                        </div>
                        
                        <div>
                            <label className='form-label'>Email</label>
                            <input
                                className={`form-control ${error ? "is-invalid" : ""}`}
                                placeholder="Enter your Gmail"
                                value={email}
                                onChange={handleEmailChange}
                            />
                            {error && <div className="text-danger mt-1">{error}</div>}
                        </div>

                        <div>
                            <label className='form-label'>Password</label>
                            <input 
                                type="password"
                                className='form-control' 
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div>
                            <label className='form-label'>Username</label>
                            <input 
                                className='form-control' 
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </div>

                        <div style={{ marginTop: '15px' }}>
                            <button className='btn btn-danger w-100' onClick={handleSubmit}>Register</button>
                        </div>

                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <button onClick={() => navigate('/')}>
                                Already have an account? <span style={{ fontWeight: "bold", color: "#3f964f" }}>Login Here</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='col-md-4 col-sm-8'></div>
            </div>
        </div>
    );
}

export default Signup;
