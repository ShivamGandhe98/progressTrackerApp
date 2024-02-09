import React,{useState} from 'react';
import axios from 'axios';
import './style.css';

const UserSignUp = ({ onClose }) => {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    password: '',
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://192.168.1.83:5000/register', formData)
        .then(res => {
          alert("User Created Successfully")
          console.log(res)
  
        })
        .catch(err => {
          console.log(err)
          if (err.response.status === 400) {
            alert("User Already Exist or All fields are required")
          }
        })
    // Add your form submission logic here
    console.log('Form submitted:', formData);
    // setFormData({
    //   username: ' ',
    //   email: ' ',
    //   role: '',
    //   password: ' ',
    // })
    // Close the popup after form submission
    onClose();
  };

  return (
    <div className="parent_container">
        <div className="login-form">
          <span className="close" onClick={onClose}>
            &times;
          </span>
              <form className='signForm' onSubmit={handleFormSubmit}>
              <p className='signuptext'>Sign Up</p>
              <label>Username:</label>
              <input type='text' className='input1' name='username' value={formData.name} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder='Enter username' />
              <label>Email:</label>
              <input type='email' className='input1' name='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder='Enter email' />
              <label>Select Role:</label>
              <select className='input1' value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                <option>admin</option>
                <option>user</option>
              </select>
              <label>Password:</label>
              <input type='password' className='input1' name='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder='Enter password' />
              <button className='sign-up' type='submit'>Add</button>  
              </form>
            </div>
    </div>
  )
}

export default UserSignUp