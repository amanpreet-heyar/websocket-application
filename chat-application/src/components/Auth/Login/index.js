
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useState } from 'react';
// import axios from 'axios';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleSubmit = (e) => {
        e.preventDefault();
        // axios.post("http://localhost:5000/login",{email,password})
        axios.post("https://websocket-application-server-git-main-amanpreetheyars-projects.vercel.app/login", { email, password })
            .then(result => {
                console.log(result);
                if (result.data.message === "Success") {
                    setUser(result.data.user);
                    navigate("/chat");
                } else {
                    alert("You are not registered to this service");
                    navigate("/signup");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <div className='login-form-container'>
                        <div><p>Login </p></div>
                        <div><input type='email' name='email' placeholder='Enter your E-mail...' value={email} onChange={(e) => setEmail(e.target.value)}></input></div>
                        <div><input type='password' name='password' placeholder='Enter your password...' value={password} onChange={(e) => setPassword(e.target.value)}></input></div>
                        <div><button>Log in</button></div>
                    </div>

                    <div>
                        <div><p>New User ?</p></div>
                        <div><Link to="/signup">Sign Up</Link></div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
