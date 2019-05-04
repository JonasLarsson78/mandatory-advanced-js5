import React, {useState} from 'react';
import { Redirect } from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import Modal from './modal';
import Breadcrumbs from './breadcrumbs'
import { deleteFiles } from './delete'
import UploadFile from './uploadfile';
import UserAccount from './userAccount'
import { Helmet } from "react-helmet";
import '../Css/home.css';
import TimeOutModal from './timeoutmodal.js';



const Home = (props) => {
  
  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  const [token, updateTokenState] = useState(token$.value)
  const [search, updateSearch] = useState(null)
  //const [createF, updateCreateF] = useState(null)
  const [showModal, updateShowModal] = useState(false)
  const [delPath, updateDelPath] = useState(null)
  //const [uploadFile, updateUpload] = useState(null)
  const [, updateChanges] = useState(null);
  const [timeOutModal, updateTimeOutModal] = useState(null)
  const [setTime, updateTime] = useState(null)


  const ResetTime = (change) => {
    updateTime(change)
  }

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
  //console.log(change)
    updateChanges(change)
  
}

/*  Function for create folder */
  const create = (folder) => {
   // updateCreateF(folder)
  }
/* ----------- end create folder----------- */
  const upload = (file) => {
    
   // updateUpload(file)
  }

  /* Functions for del files/folders */
  const del = (path) =>{
   deleteFiles(path)
  }
  const modalOnClick = (x) =>{
    updateShowModal(x)
  }
  const tiemoutModalClick = (change) => {
    updateTimeOutModal(change)
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
    <Helmet>
      <title>MyBOX</title>
    </Helmet>
    <Modal showModal2={modalOnClick} delPath={delPath} showModal={showModal} del={del}/>
    <TimeOutModal showModal3={tiemoutModalClick} showTimeout={timeOutModal} resetTime={ResetTime}></TimeOutModal>
    <header className="mainHeader">
      <div className="header-logo-wrap"><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/> </div>
        <span className="headerContent">
          <Search folder={props.location.pathname} search={searchResults} updateSearch={updateSearch}></Search>
          <span><UserAccount/></span>
          <span><button className="headerLogOutBtn" onClick={logOut}>LogOut</button></span>
        </span>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        
        <div className="left-link-wrap"><UploadFile upload={upload} folder={props.location.pathname}></UploadFile><br></br><br></br>
        <CreateFolder folder={props.location.pathname} create={create}></CreateFolder></div>
      </aside>
      <main className="mainMain">
        <Breadcrumbs /><br />
        
        <table className="mainTable">
          <tbody>
            <ListItems folder={props.location.pathname} path={path} showModal={modalOnClick} showModal3={tiemoutModalClick} search={search} /* createFolder={createF} */ /* uploadFile={uploadFile} */ pollChanges={pollChanges} setTime={setTime} resetTime={ResetTime}></ListItems>
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

export default Home;