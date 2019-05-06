import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from "react-router-dom";
import { updateToken } from './store.js'
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import Breadcrumbs from './breadcrumbs'
import UploadFile from './uploadfile';
import UserAccount from './userAccount'
import { Helmet } from "react-helmet";
import '../Css/home.css';

//import TimeOutModal from './timeoutmodal.js';


const Home = (props) => {
  const [token, updateTokenState] = useState(token$.value)
  const [data, updateData] = useState([]);
  const [thumbnails, updateThumbnails] = useState([])
  const [search, updateSearch] = useState(null)
 
  

  useEffect(() => {
   
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );
    if(props.location.pathname === '/home'){
      dbx.filesListFolder({
        path: '',
      
      })
      .then(response => {
        
        let newData = [...response.entries];
        console.log(newData)
        updateThumbnails([]);
        updateData(response.entries)
        

        dbx.filesGetThumbnailBatch({
          
          entries: response.entries.map(entry => {
          return{
            path: entry.id,
            format : {'.tag': 'jpeg'},
            size: { '.tag': 'w32h32'},
            mode: { '.tag': 'strict' }  
            }
          }) 
        }) 
        .then(response => {   
          
          updateThumbnails(response.entries)
          })
          .catch(function(error) {
            console.log(error);
           });
           

      })
      
      .catch(function(error) {
        console.log(error);
       });
     
    }
    else{
      
      let newFolder = props.location.pathname;
      newFolder = newFolder.substring(5)
      dbx.filesListFolder({
        path: newFolder,
      
      })
      .then(response => {
        
        updateThumbnails([]);
        updateData(response.entries)



        dbx.filesGetThumbnailBatch({
          
          entries: response.entries.map(entry => {
          return{
            path: entry.id,
            format : {'.tag': 'jpeg'},
            size: { '.tag': 'w32h32'},
            mode: { '.tag': 'strict' }  
            }
          }) 
        }) 
        .then(response => {   
          
          updateThumbnails(response.entries)
          })
          
          .catch(function(error) {
            console.log(error);
           });
           
      })
      .catch(function(error) {
        console.log(error);
       });

    
       
    }

   

  }, [props.location.pathname])

  
  

  const dataUpdate = (data) => {
    updateData(data)
  }

  const thumbnailUpdate = (data) => {
    updateThumbnails(data)
  } 

  const searchResults = (matches) => {
    let newArr = []
        for (let i of matches){
          newArr.push(i.metadata) 
        }
    updateSearch(newArr)
  }







  
  //const [isLoggedIn, updateIsLoggedIn] = useState(props.location.state.isLoggedIn)
  
  //const [search, updateSearch] = useState(null)
  //const [createF, updateCreateF] = useState(null)
  //const [showModal, updateShowModal] = useState(false)
  //const [delPath, updateDelPath] = useState(null)
  //const [uploadFile, updateUpload] = useState(null)
  //const [, updateChanges] = useState(null);
  //const [timeOutModal, updateTimeOutModal] = useState(null)
  //const [setTime, updateTime] = useState(null);
  //const [deleteDone, updateDeleteDone] = useState(false);
  //const [editDone, updateEditDone] = useState(false)

  /* const editIsDone = (change) => {
    updateEditDone(change)
    updateEditDone(false)
  } */

 
  /* const deleteIsDone = (change) => {
    console.log(change)
    updateDeleteDone(change)
    updateDeleteDone(false)
  } */

  /* const ResetTime = (change) => {
    updateTime(change)
  } */

  const logOut = () => {
    updateToken(null);
    updateTokenState(token$.value);
   
  }
  /* Functions for serarch files/folders */
 /*  const searchResults = (matches) => {
    let newArr = []
        for (let i of matches){
          newArr.push(i.metadata) 
        }
    updateSearch(newArr)
  } */
/* ------------ end serarch -------------- */


  if(token === null){
    return <Redirect to="/" />
  }
  
  return(
    <>
    <Helmet>
      <title>MyBOX</title>
    </Helmet>
    {/* <TimeOutModal showModal3={tiemoutModalClick}  showTimeout={timeOutModal} resetTime={ResetTime}></TimeOutModal>} */}
    <header className="mainHeader">
      <div className="header-logo-wrap"><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/> </div>
        <span className="headerContent">
          <Search folder={props.location.pathname} search={searchResults}  updateSearch={updateSearch}></Search>
          <span><UserAccount/></span>
          <span><button className="headerLogOutBtn" onClick={logOut}>LogOut</button></span>
        </span>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        
        <div className="left-link-wrap"><UploadFile folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}></UploadFile><br></br><br></br>
        <CreateFolder folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}></CreateFolder></div>
      </aside>
      <main className="mainMain">
      <Breadcrumbs /><br />
        
        <table className="mainTable">
          <tbody>
            <ListItems folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}/* path={path} */ /* showModal={modalOnClick} */ /* showModal3={tiemoutModalClick} */ search={search} /* createFolder={createF} */  /* uploadFile={uploadFile} */ /* pollChanges={pollChanges} */ /* setTime={setTime} */ /* resetTime={ResetTime} */ /* delPath={delPath} */ /* deleteDone={deleteDone} */ /* editIsDone={editIsDone}  *//* editDone={editDone} */ renderData={data} thumbnails={thumbnails}></ListItems>
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