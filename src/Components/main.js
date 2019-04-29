import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import '../Css/main.css';

const Main = (props) => {

  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)

  const [search, updateSearch] = useState(null)
  const [createF, updateCreateF] = useState(null)

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

    updateSearch(newArr)
  }

  const create = (folder) => {



    updateCreateF(folder)
  }

  if(token === null){
    return <Redirect to="/" />
  }
  
  return(
    <>
    <header className="mainHeader">
    <div className="header-logo-wrap"><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/> </div>
    <Search folder={props.location.pathname} search={searchResults}></Search>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        <div className="left-link-wrap">link</div>

      </aside>
      <main className="mainMain">
        <p>Main</p>
        <CreateFolder folder={props.location.pathname} create={create}></CreateFolder>
        <button onClick={logOut}>logOut</button>
        <ul>
          <ListItems folder={props.location.pathname} search={search} createFolder={createF}></ListItems>
        </ul>
      </main>
      <aside className="rightSide">
        <div className="aside"></div>
        höger aside
      </aside>
      
    </div>
    </>
  )
}

export default Main;