import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { useNavigate, useParams } from 'react-router-dom';

const UserDashboard = () => {
  const paramId = useParams();
  const [userTask, setUserTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [userName, setUsername] = useState('');
  const [userTaskTitle, setUserTaskTitle] = useState('');
  const navigate = useNavigate();
  const [percentagefield, setPercentage_field] = useState(0);
  // const [firstLogin, setFirstLogin] = useState(true);

  const handleIncreaseProgress = () => {
    setPercentage_field((prevProgress) => Math.min(prevProgress + 10, 100));
  };

  let obj = {
    editTask,
    percentagefield,
    userName,
    userTaskTitle,
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };
  console.log(userTask)
  const handleEnter = async () => {
    await axios
      .post('http://192.168.1.83:5000/submit_task', obj)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setEditTask('');
          alert('Task Submitted');
        }
      })
      .catch((err) => console.log(err));
  };
  
  const fetchData = async () => {
    
    // const paramString = paramId.toString();
    console.log('paramId',paramId)
    const id = paramId._id
    console.log(id)
    await axios.get(`http://192.168.1.83:5000/gettask?id=${id}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
    
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token===null){
      navigate('/');
    }
    const name = localStorage.getItem('username');
    if(userName===''){
      setUsername(name);
    }
    fetchData();
  },[])
  useEffect(() => {
    // Sets userTaskTitle to the first task title
    if (userTask && userTask.tasks && userTask.tasks.length > 0) {
      userTask.tasks.forEach(task => {
        setUserTaskTitle(task.title);
        setPercentage_field(task.percentage_field);
      });
      // setUserTaskTitle(userTask.tasks[0].title);

      // if (firstLogin) {
      //   setProgress(progress);
      //   setFirstLogin(false);
      // } else {

      //   setProgress(userTask.tasks[0].percentage_field);
      // }
    }
  }, [userTask, percentagefield]);

  
  console.log(userName);

  return (
    <div className='containerD'>
        <div className="dashboard" style={{display:'flex',width:"100%",justifyContent:'space-between'}}>
        <div><h1>Dashboard</h1></div>
        <div style={{display:'flex'}}><p>Hello {userName}</p>
        <button className='userSignout' onClick={handleLogout}>
          Sign Out
        </button>
        </div>
      </div>
      <div className='task'>

      {userTask.tasks && userTask.tasks.length > 0 ? (
          userTask.tasks.map((user,index) => (
            user.percentagefield !== 0 && (
              <div className='taskForm' key={user.uniqueIdentifier}>
                <label className='eleWidth'>Task Title:</label>
                <React.Fragment>
                  <h3>{user.title}</h3>
                  <p>Due Date: {user.date}</p>
                </React.Fragment>
                <textarea
                  className='textData'
                  placeholder='write here'
                  onChange={(e) => setEditTask(e.target.value)}
                />
                <div className='progress-bar'>
                  <div className='progress-bar-fill' style={{ width: `${user.percentage_field}%` }}>
                    {`${user.percentage_field}%`}
                  </div>
                </div>
                <button type='button' onClick={handleIncreaseProgress}>
                  Increase Progress
                </button>{' '}
                <button type='submit' onClick={handleEnter}>
                  Enter
                </button>
              </div>
            )
          ))
        ) : (
          <h1 style={{ color: 'red' }}>You don't have any tasks to perform</h1>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
