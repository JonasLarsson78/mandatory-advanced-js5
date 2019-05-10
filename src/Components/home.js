import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import { Redirect } from "react-router-dom";
import {token$} from './store.js';
import ListItems from './listitems';
import CreateFolder from './createfolder';
import Search from './search';
import Breadcrumbs from './breadcrumbs';
import UploadFile from './uploadfile';
import UserAccount from './userAccount';
import { Helmet } from "react-helmet";
import LogOut from './logout'
import FavoriteList from "./favoriteList.js"
import {favorites$} from './store'
import {updateFavoriteToken} from './store'
import '../Css/home.css';




const Home = (props) => {
  const [token, updateTokenState] = useState(token$.value)
  const [data, updateData] = useState([]);
  const [thumbnails, updateThumbnails] = useState([])
  const [thumbnailsLoaded, updateThumbnailsLoaded] = useState(false);
  const [favorites, updateFavorites] = useState([]);
  const [oldData, updateOldData] = useState([])
  const [searchMode, updateSearchMode] = useState(false)


  useEffect(() => {
    const subscription = favorites$.subscribe(updateFavorites);
    return () => subscription.unsubscribe();
  }, []);

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
      
       if(searchMode){
        return;
      }
        
      const poll = setInterval(() => {
       
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
           updateOldData(data)
            
            let responseRev = response.entries.map(x => x.rev).filter(y => y !== undefined)
            let oldrespRev = oldData.map(x => x.rev).filter(y => y !== undefined)
            let responseName = response.entries.map(x => x.name).filter(y => y !== undefined)
            let oldrespName = oldData.map(x => x.name).filter(y => y !== undefined)

            const diffRev = responseRev.filter(el => !oldrespRev.includes(el));
            const diffName = responseName.filter(el => !oldrespName.includes(el))

            //console.log(oldData.length)
            //console.log(response.entries.length)

            if(oldData.length < response.entries.length){
             
              updateData(response.entries)
            }


            if(oldData.length !== response.entries.length || diffRev.length > 0 || diffName.length > 0){
              
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
              .then(responseThumbs => {   
                
                 updateThumbnails(responseThumbs.entries)
                 updateData(response.entries)
                 
                })
                .catch(function(error) {
                  console.log(error);
                 });
              

            }

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
            
            updateOldData(response.entries)

            let responseRev = response.entries.map(x => x.rev).filter(y => y !== undefined)
            let oldrespRev = oldData.map(x => x.rev).filter(y => y !== undefined)
            let responseName = response.entries.map(x => x.name).filter(y => y !== undefined)
            let oldrespName = oldData.map(x => x.name).filter(y => y !== undefined)

            const diffRev = responseRev.filter(el => !oldrespRev.includes(el));
            const diffName = responseName.filter(el => !oldrespName.includes(el))


            if(oldData.length < response.entries.length){
              
             
              updateData(response.entries)
              
            }

            if(oldData.length !== response.entries.length || diffRev.length > 0 || diffName.length > 0){
    
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
            .then(responseThumbs => {   
              updateThumbnails(responseThumbs.entries)
              updateData(response.entries)
              })
              
              .catch(function(error) {
                console.log(error);
               });
              }

          })
        
          .catch(function(error) {
            console.log(error);
           });
        }
      }, 5000);
      
      
    
    return () => clearInterval(poll);

    }) 



    
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
          updateOldData(response.entries)

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
        updateOldData(response.entries)

          
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
    updateOldData(data)
    updateData(data)
    
  }

  const thumbnailUpdate = (data) => {
    updateThumbnails(data)
  } 

  const oldDataUpdate = (data) => {
    updateOldData(data)
    
  }

  const favUpdate = (data) => {
    updateFavorites(data);
    updateFavoriteToken(data);
  }

  const searchUpdateMode = (bool) => {
      updateSearchMode(bool)
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
          <Search searchUpdateMode={searchUpdateMode} searchData={data} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} />
          <span><UserAccount/></span>
          <span><LogOut updateTokenState={updateTokenState}/></span>
        </span>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        
        <div className="left-link-wrap"><UploadFile folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}></UploadFile><br></br><br></br>
        <CreateFolder folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} oldDataUpdate={oldDataUpdate}></CreateFolder></div>
      </aside>
      <main className="mainMain">
      <Breadcrumbs /><br />
        <table className="mainTable">
          <thead>
            <tr className="home-thead-tr">
            <th colSpan="2">
              Name
            </th>
            <th>
              File size
            </th>
            <th>
              Last edited
            </th>
            <th style={{ textAlign: 'center' }}>
            Del
            </th>
            <th style={{ textAlign: 'center' }}>
             Ren 
            </th>
            <th style={{ textAlign: 'center' }}>
             Mov
            </th>
            <th style={{ textAlign: 'center' }}>
              Fav
            </th>
            <th style={{ textAlign: 'center' }}>
              Cop
            </th>
            </tr>
          </thead>
          <tbody>
            <ListItems favorites={favorites} favUpdate={favUpdate} thumbnailsLoaded={thumbnailsLoaded} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate}  renderData={data} thumbnails={thumbnails}></ListItems>
          </tbody>
        </table>
      </main>
      <aside className="rightSide">
        <div className="aside"></div>
         <FavoriteList data={data} />
      </aside>
    </div>
    
    </>
  )
}

export default Home;