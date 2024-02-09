import React, { useEffect, useState } from 'react';
import UserSignUp from '../UserSignUp/UserSignUp';
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios';
import './style.css';

const Dashboard = () => {

  const location = useLocation();
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [users, setUsers] =useState([]);
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState({
    title: '',
    username: '',
  });

  const openPopup = () => {
    setPopupVisibility(true);
  };

  const closePopup = () => {
    setPopupVisibility(false);
  };
  
  const handleSubmit = async() => {
    const token = localStorage.getItem('token');
    console.log('token',token)
  await axios.post('http://192.168.1.83:5000/addtask',taskList, {
    headers: {
      "Authorization": token,
      'Content-Type': 'application/json',
    }})
  .then((res) => {
    console.log(res)
    alert("Task Added Successfully")
  })
  .catch((err) => console.log(err))
  setTaskList({
    ...taskList,
    title: '',
    username: '',
  });
// console.log('tasks',taskList)
// console.log('tasks',taskList)
  
  }
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };
  const fetchUser = async () => {
   await axios.get('http://192.168.1.83:5000/users')
       .then((res)=>{
        const users = res.data.users
        // console.log('name',users);
        setUsers(users)

       })
       .catch(err => console.log(err))

  }
  useEffect(()=>{
    fetchUser();
  },[])
  
  useEffect(() => {
    if (location.state) {
      // console.log('location', location.state);
      setAdminUsername(location.state.username);
    }
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    if(adminUsername === ''){
      setAdminUsername(name);
    }
    if(token===null){
      navigate('/');
    }
  }, [location.state]);

console.log('users',users)
const token = localStorage.getItem('token');
// console.log(token);

  return (
    <div className='containerD'>
      <div className="dashboard" style={{display:'flex',width:"100%",justifyContent:'space-between'}}>
        <div><h1>Dashboard</h1></div>
        <div style={{display:'flex'}}>
        <p>Welcome {adminUsername}</p>
        <button onClick={openPopup}>Add User</button>
        <button className='userSignout' onClick={handleLogout}>Sign Out</button>
        </div>
      </div>
      <div className="formContainer">   
      {isPopupVisible && <UserSignUp onClose={closePopup}/>}     
        <div className="addTaskForm">
          <h3 className='adTask'>ADD TASK</h3>

          <input type="text" className='taskTitle' value={taskList.title} onChange={(e) => setTaskList({ ...taskList, title: e.target.value})} placeholder='Enter Task Title' />
          <select className='taskUser' value={taskList.username} onChange={(e) => setTaskList({ ...taskList, username: e.target.value })}>
            {users && users.filter(user => user.role === 'user') // Filter users based on their role
                    .map(user => (
                  <option key={user.username}>{user.username}</option>
                  ))}
              </select>

          <button onClick={handleSubmit} className='addTask'>Add</button>
        </div>
      </div>
        <div className="tasks">
          <div className="task1">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Comment</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                
              {users.map((user,index) => {
              if (user.tasks && user.tasks.length > 0) {
              return (
                <tr key={user._id}>
                  <td>{user.tasks[index].title}</td>
                  <td>{user.tasks[index].textarea_field}</td>
                  <td>{user.username}</td>
                  <td>{user.tasks[index].date}</td>
                  <td>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${user.tasks[index].percentage_field}%` }}>{user.tasks[0].percentage_field}%</div>
                    </div>
                    {user.tasks[index].percentage_field}
                  </td>
                </tr>
          );
  }
  return null; // Skip users without tasks
})}

              </tbody>
            </table>
          </div>
        </div>
    </div>
  )
}

export default Dashboard