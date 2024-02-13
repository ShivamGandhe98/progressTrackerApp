import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

const AddTaskForm = ({ onClose, users }) => {
  const [taskList, setTaskList] = useState({
    title: '',
    username: '',
    image: '',
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setTaskList({ ...taskList, image: file });
  };

  const handleSubmit =  async() => {
    const token = localStorage.getItem('token');
    await axios.post('http://192.168.1.83:5000/task/addtask', taskList, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        alert('Task Added Successfully');
      })
      .catch((err) => console.log(err));
    setTaskList({
      title: '',
      username: '',
      image: ''
    });
    console.log('taskList',taskList)
    onClose();
  };

  return (
    <form style={{display:'flex',justifyContent:'center',marginTop:'86px'}}>
    <div className="addTaskForm">
        <span className="close" onClick={onClose}>
            &times;
          </span>
      <h3 className="adTask" style={{width:'auto',fontSize:'20px'}}>ADD TASK</h3>
      <input
        type="text"
        className="taskTitle"
        value={taskList.title}
        onChange={(e) => setTaskList({ ...taskList, title: e.target.value })}
        placeholder="Enter Task Title"
      />
      <select
        className="taskUser"
        value={taskList.username}
        onChange={(e) => setTaskList({ ...taskList, username: e.target.value })}
      >
        {users &&
          users
            .filter((user) => user.role === 'user')
            .map((user) => (
              <option key={user.username}>{user.username}</option>
            ))}
      </select>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button onClick={handleSubmit} className="addTask">
        Add
      </button>
    </div>
    </form>
  );
};

export default AddTaskForm;
