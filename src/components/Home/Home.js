import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
import image from '../../image/Progress.png';
import './style.css';
import axios from 'axios';

const Home = () => {
    // const [action, setAction] = useState("SignUp");
    const navigate = useNavigate();
    const [role, setRole] = useState();
    // const [user, setUser] = useState({
    //   username: "",
    //   email: "",
    //   password: "",
    // });
  
    const [loginUser, setLoginUser] = useState();
    // const [userToken, setUserToken] = useState();
    const [loginData, setLoginData] = useState({
      email: '',
      password: '',
    });
    // const [saveToken, setSaveToken] = useState('');  

    // const handleFormSubmit = async (e) => {
    //   e.preventDefault();
      
    //   setUser({
    //     username: "",
    //     email: "",
    //     password: "",
    //   });
    // }
  
    const handleSignInFormSubmit = async (e) => {
      console.log('logindata', loginData)
      e.preventDefault();
      await axios.post('http://192.168.1.83:5000/auth/login', loginData)
        .then(res => {
          const token = res.data.token;
          const name = res.data.username;
          localStorage.setItem('token', token);
          localStorage.setItem('username',name);
          setRole(res.data.role);
          setLoginUser(res.data);
          console.log('res', res)
        })
        .catch(err => {
          if(err){
            alert("Invalid Email or Password");
          }
          console.log(err)
        })
    }
  

  useEffect(() => {
    const savedToken = localStorage.getItem('token');

    if (savedToken) {

      if (role === 'admin') {
        navigate(`/dashboard`,{state: loginUser});
      } else if (role === 'user') {
        // Fetch user data if needed and then navigate
        navigate(`/userDashboard/${loginUser._id}`,{state: loginUser});
      }
    }
  }, [role]); 

  return (
    <div className='container'>
      <div className="left-container">
        <h1>Progress Tracker</h1>
        <img className="logo-image" src={image} alt="img" />
      </div>
      <div className="right-container">
      <div className="signin-form">
        <form className='logForm' onSubmit={handleSignInFormSubmit}>
          <p className='signintext' style={{color:"white"}}>Sign In</p>
          <label>Email:</label>
          <input type='email' className='input' onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} name='email' placeholder='Enter email' />
          <label>Password:</label>
          <input type='password' className='input' onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} name='password' placeholder='Enter password' />
          <button type='submit' className='sign-up'>Sign In</button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Home;
