import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';

import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ConnectSkool from './components/ConnectSkool';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/dashboard' element={<Dashboard />} />
          <Route exact path='/connect-skool' element={<ConnectSkool/>} />
          <Route exact path='/choose-community' element={<h1>Choose community</h1>} />
        </Routes>
      </Router> 
    </div>
  );
}

export default App;
