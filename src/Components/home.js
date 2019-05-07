import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from "react-router-dom";
import {token$} from './store.js';
import ListItems from './listitems'
import CreateFolder from './createfolder'
import Search from './search'
import Breadcrumbs from './breadcrumbs'
import UploadFile from './uploadfile';
import UserAccount from './userAccount'
import { Helmet } from "react-helmet";
import LogOut from './logout'
import '../Css/home.css';


const Home = (props) => {
  const [token, updateTokenState] = useState(token$.value)
  const [data, updateData] = useState([]);
  const [thumbnails, updateThumbnails] = useState([])
  const [thumbnailsLoaded, updateThumbnailsLoaded] = useState(false);

<<<<<<< HEAD


=======
>>>>>>> 9226804aa5adc80a69851c472acfce2315d3dcbb

  useEffect(() => {

    if (thumbnails.length === data.length) {
      const isLoaded = thumbnails.every((x, idx) => {
        return x[".tag"] === "failure" || x.metadata.id === data[idx].id;
      });

      updateThumbnailsLoaded(isLoaded);      
    } else {
      updateThumbnailsLoaded(false);
    }

  }, [data, thumbnails]);
  

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

      console.log(newFolder);
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
          console.log(response)
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

  if(token === null){
    return <Redirect to="/" />
  }
  
  return(
    <>
    <Helmet>
      <title>MyBOX</title>
    </Helmet>
    <header className="mainHeader">
      <div className="header-logo-wrap"><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/> </div>
        <span className="headerContent">
          <Search searchData={data} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} />
          <span><UserAccount/></span>
          <span><LogOut updateTokenState={updateTokenState}/></span>
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
            <ListItems thumbnailsLoaded={thumbnailsLoaded} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}  renderData={data} thumbnails={thumbnails}></ListItems>
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