import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import UserDashboard from './components/UserDashboard/UserDashboard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>} />   
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path="/userDashboard/:_id" element={<UserDashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
