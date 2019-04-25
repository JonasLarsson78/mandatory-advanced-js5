import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import '../Css/main.css';

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
    <div className="mainHeader">
    mainHeader
    </div>
    <div className="mainMain">
      <p>Du är nu på din sida</p>
      <button onClick={logOut}>logOut</button>
      <ul>
      <ListItems listData={data}></ListItems>
      </ul>
    </div>
    <div className="mainSide">
      mainSide
    </div>
    </>
  )
}

export default Main;