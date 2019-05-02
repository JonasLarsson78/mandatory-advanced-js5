import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import Modal from './modal';
import { deleteFiles } from './delete'
import UploadFile from './uploadfile';
import '../Css/main.css';

const Main = (props) => {
  
  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)
  const [search, updateSearch] = useState(null)
  const [createF, updateCreateF] = useState(null)
  const [showModal, updateShowModal] = useState(false)
  const [delPath, updateDelPath] = useState(null)
  const [uploadFile, updateUpload] = useState(null)
  const [changes, updateChanges] = useState(null)

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

const pollChanges = (change) => {
  console.log(change)
  updateChanges(change)
  

}

/*  Function for create folder */
  const create = (folder) => {
    updateCreateF(folder)
  }
/* ----------- end create folder----------- */
  const upload = (file) => {
    
    updateUpload(file)
  }

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

  //const modalRender = ((showModal) ? <Modal showModal2={modalOnClick} delPath={delPath} showModal={showModal} del={del}/> : false);
  
  return(
    <>
    <Modal showModal2={modalOnClick} delPath={delPath} showModal={showModal} del={del}/>
    <header className="mainHeader">
      <div className="header-logo-wrap"><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/> </div>
      <Search folder={props.location.pathname} search={searchResults} updateSearch={updateSearch}></Search>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        <div className="left-link-wrap"><a href="http://www.example.com" className="left-link">link</a> </div>
      </aside>
      <main className="mainMain">
        <p>Main</p>
        <UploadFile upload={upload} folder={props.location.pathname}></UploadFile><br></br><br></br>
        <CreateFolder folder={props.location.pathname} create={create}></CreateFolder>
        <button onClick={logOut}>logOut</button>
        <table className="mainTable">
          <tbody>
            <ListItems folder={props.location.pathname} path={path} showModal={modalOnClick} search={search} createFolder={createF} uploadFile={uploadFile} pollChanges={pollChanges}></ListItems>
          </tbody>
        </table>
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