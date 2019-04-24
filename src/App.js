import React from 'react';
import './App.css';
import Login from './Components/login';
import Auth from './Components/auth';
import Main from './Components/main';
import { BrowserRouter as Router, Route, Link}from "react-router-dom";

function App() {
  return (
    <Router>
    <div className="App">
    </div>
    <Route exact path='/' component={Login} />
    <Route path='/auth' component={Auth} />
    <Route path='/main' component={Main} />
    </Router>
  );
}

export default App;
