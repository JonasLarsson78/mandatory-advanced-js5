import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import Modal from './modal';
import { deleteFiles } from './delete'
import '../Css/main.css';

const Main = (props) => {

  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)

  const [search, updateSearch] = useState(null)
  const [createF, updateCreateF] = useState(null)
  const [showModal, updateShowModal] = useState(false)
  const [delPath, updateDelPath] = useState(null)

  const logOut = () => {
    updateToken(null);
    updateTokenState(token$.value);
    //updateIsLoggedIn(false)
  }
  /* Functions for serarch files/folders */
  const searchResults = (matches) => {
    let newArr = []
        for (let i of matches){
          newArr.push(i.metadata) 
        }
    updateSearch(newArr)
  }
/* ------------ end serarch -------------- */

/*  Function for create folder */
  const create = (folder) => {
    updateCreateF(folder)
  }
/* ----------- end create folder----------- */

  /* Functions for del files/folders */
  const del = (path) =>{
   deleteFiles(path)
  }
  const modalOnClick = (x) =>{
    updateShowModal(x)
  }

  const path = (path) => {
    updateDelPath(path)
  }
  /* ----------- end del ----------------- */

  if(token === null){
    return <Redirect to="/" />
  }
  return(
    <>
    <Modal showModal2={modalOnClick} delPath={delPath} showModal={showModal} del={del}/>
    <div className="mainHeader">
    mainHeader<br/>
    <Search folder={props.location.pathname} search={searchResults} updateSearch={updateSearch}></Search>
    </div>
    <div className="mainMain">
      <p>Du är nu på din sida</p>
      <CreateFolder folder={props.location.pathname} create={create}></CreateFolder>
      <button onClick={logOut}>logOut</button>
     
      <ul>
        <ListItems folder={props.location.pathname} path={path} showModal={modalOnClick} search={search} createFolder={createF}></ListItems>
      </ul>
    </div>
    <div className="mainSide">
      mainSide
    </div>
    </>
  )
}

export default Main;