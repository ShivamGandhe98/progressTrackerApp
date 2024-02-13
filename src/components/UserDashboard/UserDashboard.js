import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';

const UserDashboard = () => {
  const paramId = useParams();
  const [userTask, setUserTask] = useState([]);
  const [textArea, setTextArea] = useState('');
  const [userName, setUsername] = useState('');
  const navigate = useNavigate();

  const handleProgressChange = (index, newValue) => {
    const updatedUserTasks = [...userTask];
    const updatedUser = { ...updatedUserTasks[index] };
    updatedUser.percentage = newValue;
    updatedUserTasks[index] = updatedUser;
    setUserTask(updatedUserTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const handleEnter = async (index) => {
    const taskData = {
      task_id: userTask[index].task_id,
      user_id: userTask[index].user_id,
      percentage: userTask[index].percentage,
      textarea: textArea,
    };
    console.log('taskData', taskData);
    await axios
      .post('http://192.168.1.83:5000/task/submit_task', taskData, config)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          alert('Task Submitted');
        }
      })
      .catch((err) => console.log(err));
  };
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': token,
    },
  };

  const fetchData = async () => {
    // console.log('paramId', paramId);
    const id = paramId._id;
    // console.log(id);

    await axios
      .get(`http://192.168.1.83:5000/task/gettask?id=${id}`, config)
      .then((res) => {
        setUserTask(res.data);
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      navigate('/');
    }
    const name = localStorage.getItem('username');
    if (userName === '') {
      setUsername(name);
    }
    fetchData();
  }, []);
  console.log(userTask);
  const myStyle = {
    height: userTask.length < 3 ? '100vh' : 'auto',
  };
  // console.log(userName);

  return (
    <div className='containerDash' style={{display:'flex',flex:'1',flexDirection:'row',height:'100vh'}}>
      <div style={{display:'flex',flex:'0.2',width:'300px',flexDirection:'column',background:'purple', textAlign:'center'}}><h1 style={{color:'white'}}>Dashboard</h1></div>
      <div style={{display:'flex',flex:'0.8',flexDirection:'column'}}>
      <div className="dashboard2" style={{ display: 'flex', width: "100%", justifyContent: 'space-between' }}>
        <div></div>
        <div style={{ display: 'flex' }}><p>Hello {userName}</p>
          <button className='userSignout' onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
      <div className='task' style={myStyle}>

        {userTask && userTask.length > 0 ? (
          userTask.map((user, index) => (
            (
              <div className='taskForm' key={user.task_id}>
                <label className='eleWidth'>Task Title:</label>
                <React.Fragment>
                  <h3>{user.title}</h3>
                  <p>Due Date: {user.date}</p>
                </React.Fragment>
                <textarea
                  className='textData'
                  placeholder='write here'
                  onChange={(e) => setTextArea(e.target.value)}
                />
                <div className='progress-bar'>
                  <input
                    style={{width:'100%'}}
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    value={user.percentage}
                    onChange={(e) => handleProgressChange(index, e.target.value)}
                  />
                  {`${user.percentage}%`}
                </div>
                <button type='submit' onClick={() => handleEnter(index)}>
                  Submit
                </button>
              </div>
            )
          ))
        ) : (
          <h1 style={{ color: 'red' }}>You don't have any tasks to perform</h1>
        )}
      </div>
      </div>
      
      
    </div>
  );
};

export default UserDashboard;
