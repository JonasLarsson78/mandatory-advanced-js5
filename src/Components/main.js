import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import Search from './search'
import '../Css/main.css';

const Main = (props) => {

  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)

  const [search, updateSearch] = useState(null)

  const logOut = () => {
    updateToken(null);
    updateTokenState(token$.value);
    //updateIsLoggedIn(false)
  }
  const searchResults = (matches) => {
    
    let newArr = []
        for (let i of matches){
          newArr.push(i.metadata) 
        }
        console.log(newArr)
    updateSearch(newArr)
  }

  if(token === null){
    return <Redirect to="/" />
  }
  
  return(
    <>
    <div className="mainHeader">
    mainHeader<br/>
    <Search folder={props.location.pathname} search={searchResults}></Search>
    </div>
    <div className="mainMain">
      <p>Du är nu på din sida</p>
      <button onClick={logOut}>logOut</button>
      <ul>
        <ListItems folder={props.location.pathname} search={search}></ListItems>
      </ul>
    </div>
    <div className="mainSide">
      mainSide
    </div>
    </>
  )
}

export default Main;