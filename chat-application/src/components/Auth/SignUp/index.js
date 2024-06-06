import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/signup", { userName, email, password })
      .then(result => {
        console.log(result);
        navigate('/login');
      })
      .catch(err => console.log(err));
  };

  return (
    <div className='signup-container'>
      <div className='signup-form'>
        <form onSubmit={handleSubmit}>
          <div className='signup-form-container'>
            <div><p>Sign Up</p></div>
            <div><input type='text' name='username' placeholder='Enter your username...' value={userName} onChange={(e) => setUserName(e.target.value)}></input></div>
            <div><input type="email" name="email" placeholder="Enter Your E-mail..." value={email} onChange={(e) => setEmail(e.target.value)}></input></div>
            <div><input type='password' name='password' placeholder='Enter your password...' value={password} onChange={(e) => setPassword(e.target.value)}></input></div>
            <div><button>Sign Up</button></div>
          </div>
          <div>
            <div><p>Already have an Account?</p></div>
            <div><Link to="/login">Log in</Link></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
