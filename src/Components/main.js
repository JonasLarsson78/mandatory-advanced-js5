import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'

const Main = (props) => {

  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)


  const logOut = () => {
    updateToken(null);
    updateTokenState(token$.value);
    //updateIsLoggedIn(false)
  }

  if(token === null){
    return <Redirect to="/" />
  }

  return(
    <>
    <p>Du är nu på din sida</p>
    <button onClick={logOut}>logOut</button>
    <ul>
    <ListItems></ListItems>
    </ul>
    </>
  )
}

export default Main;