import React from 'react';
import Login from './Components/login';
import Auth from './Components/auth';
import Home from './Components/home';
import { HashRouter as Router, Route}from "react-router-dom";




function App() {

  return (
    <Router>
    <div className="App">
    
    
    </div>
    
    <Route exact path='/' component={Login} />
    <Route path='/auth' component={Auth} />
    <Route path='/home' component={Home} />

   
    </Router>
  );
}

export default App;
