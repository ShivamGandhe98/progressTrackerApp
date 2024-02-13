import React, { useEffect, useState } from 'react';
import UserSignUp from '../UserSignUp/UserSignUp';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './style.css';
import AddTaskForm from '../AddTaskForm/AddTaskForm';

const Dashboard = () => {
  const location = useLocation();
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [completedTask, setCompletedTask] = useState([]);
  const [pendingTask, setPendingTask] = useState([]);
  const [isTaskCompleted, setIsTaskCompleted] = useState(null);
  const [isAddTaskFormVisible, setAddTaskFormVisibility] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const navigate = useNavigate();

  const openPopup = () => {
    setPopupVisibility(true);
  };

  const closePopup = () => {
    setPopupVisibility(false);
  };

  const openAddTaskForm = () => {
    setAddTaskFormVisibility(true);
  };

  const closeAddTaskForm = () => {
    setAddTaskFormVisibility(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Authorization': token,
    },
  };

  const fetchUser = async () => {
    await axios.get('http://192.168.1.83:5000/auth/users', config)
      .then((res) => {
        const users = res.data.users;
        setUsers(users);
      })
      .catch((err) => console.log(err));
  };

  const fetchTasks = async () => {
    await axios.get('http://192.168.1.83:5000/task/getalltasks', config)
      .then((res) => {
        setAllTasks(res.data.tasks);
      })
      .catch((err) => console.log(err));
  };
// console.log('allTask',allTasks)
  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, []);

  useEffect(() => {
    const completedTasks = allTasks.filter(task => task.completed);
    const pendingTasks = allTasks.filter(task => !task.completed);
  
    setCompletedTask(completedTasks);
    setPendingTask(pendingTasks);
  }, [allTasks]);
  
  // console.log('completed',completedTask)
  // console.log('pending',pendingTask)

  useEffect(() => {
    if (location.state) {
      setAdminUsername(location.state.username);
    }
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');
    if (adminUsername === '') {
      setAdminUsername(name);
    }
    if (token === null) {
      navigate('/');
    }
  }, [location.state]);

  return (
    <div className='containerD'>
      <div style={{ display: 'flex', flexDirection: 'row', flex: '1', width: '100vw%' }}>
        <div className='left-panel' style={{ display: 'flex', flex: '0.2', flexDirection: 'column', width: '300px', height: '100vh', backgroundColor: 'purple' }}>
          <h1 style={{ height: '70px', textAlign: 'center', color: 'white' }}>Dashboard</h1>
          <button onClick={() => {
            setIsTaskCompleted(true)
            closeAddTaskForm();
            }}>Completed Task</button>
          <button onClick={() => {
            setIsTaskCompleted(false)
            closeAddTaskForm();
            }}>Pending Task</button>
          
        </div>
        <div style={{ display: 'flex', flex: '0.8', width: 'auto', flexDirection: 'column' }}>
          <div className="dashboard" style={{ display: 'flex', width: "100%", justifyContent: 'space-between' }}>
            <div></div>
            <div style={{ display: 'flex' }}>
              <p>Welcome {adminUsername}</p>
              <button onClick={openAddTaskForm}>Add Tasks</button>
              <button onClick={openPopup}>Add User</button>
              <button className='userSignout' onClick={handleLogout}>Sign Out</button>
            </div>
          </div>
          
            {isPopupVisible && <UserSignUp onClose={closePopup} />}
            {isAddTaskFormVisible ? (  
              <AddTaskForm onClose={closeAddTaskForm} users={users} />
            ):
            
          <div className="tasks" style={{display:'flex', flexDirection:'row'}}>
            <div className="task1" style={{display:'flex',flexWrap:'wrap'}}>

            {isTaskCompleted === null
                ? allTasks.map((task, index) => (
                    <div className="taskCard" key={task._id?.$oid}>
                      <h4>Title: {task.title}</h4>
                      <p>Username: {task.username}</p>
                      <p>Date: {task.date}</p>
                    </div>
                  )):
            isTaskCompleted ? completedTask.map((task, index) => (
            <div className="taskCard" key={task._id?.$oid}>
              <h4>Title: {task.title}</h4>
              <p>Username: {task.username}</p>
              <p>Date: {task.date}</p>
            </div>
          )) :
          pendingTask.map((task, index) => (
            <div className="taskCard" key={task._id?.$oid}>
              <h4>Title: {task.title}</h4>
              <p>Username: {task.username}</p>
              <p>Date: {task.date}</p>
            </div>
          ))}

            </div>
          </div>
            }
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
