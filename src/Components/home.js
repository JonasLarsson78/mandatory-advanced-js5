import React, {useState, useEffect, useRef} from 'react';
import { Dropbox } from 'dropbox';
import { getThumbnails } from './getthumbnails'
import { Redirect, Link } from "react-router-dom";
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
import { errorFunction } from './error.js'
import '../Css/home.css';



const Home = (props) => {


  const [token, updateTokenState] = useState(token$.value)
  const [data, updateData] = useState([]);
  const [thumbnails, updateThumbnails] = useState([])
  const [thumbnailsLoaded, updateThumbnailsLoaded] = useState(false);
  const [favorites, updateFavorites] = useState([]);
  const [oldData, updateOldData] = useState([])
  const [pollMode, updatePollMode] = useState(false)
  const [clearSearch, updateClearSearch] = useState(true)
  const [errorMessage, updateErrorMessage] = useState('')
  

  const dataRef = useRef([]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (errorMessage === ''){
      return;
    }
    console.log('error')
    setTimeout(() => {
      updateErrorMessage("")
    }, 5000);
  }, [errorMessage]);

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

      
      
       if(pollMode){
        return;
      }
        
      const poll = setInterval(() => {
        //console.log('Useffect körs')
        const option = {
          fetch: fetch,
          accessToken: token$.value
        };
        const dbx = new Dropbox(
          option,
        );

        const dataTmp = dataRef.current;

        
        if(props.location.pathname === '/home'){
          dbx.filesListFolder({
            path: '',
          
          })
          .then(response => {

            if (dataRef.current !== dataTmp) {
              
              return;
            }
           
           //updateOldData(data)
            
            let responseRev = response.entries.map(x => x.rev).filter(y => y !== undefined)
            let oldrespRev = oldData.map(x => x.rev).filter(y => y !== undefined)
            let responseName = response.entries.map(x => x.name).filter(y => y !== undefined)
            let oldrespName = oldData.map(x => x.name).filter(y => y !== undefined)

            const diffRev = responseRev.filter(el => !oldrespRev.includes(el));
            const diffName = responseName.filter(el => !oldrespName.includes(el))

           
             if(response.entries.length < oldData.length){
              
              updateThumbnails([])
              updateData(response.entries)
            }
            

            if (response.entries.length !== oldData.length  || diffRev.length > 0 || diffName.length > 0){
              updatePollMode(true)
              console.log('poll körs root')
              console.log('poll stoppas tillfälligt root')
              
                getThumbnails(dbx, response.entries)

                .then(entries => {
                 
                  updateData(response.entries)
                  updateOldData(response.entries)
                  updateThumbnails(entries)
                  
                }) 
                .then(rep => {
                  updatePollMode(false)
                  console.log('Poll startar igen root')

                })
                .catch(function(error) {
                  errorFunction(error, updateErrorMessage)
                  console.log('Home Thumbnails rad 136');
                 });
              

            }
            else{
              console.log('Poll har inte körts för root')
              return;
            }

          })
          
          .catch(function(error) {
            errorFunction(error, updateErrorMessage)
            console.log('Home filesrequest 150');
           });
    
        }
        else{
          
          let newFolder = props.location.pathname;
          newFolder = newFolder.substring(5)
    
          dbx.filesListFolder({
            path: newFolder,
          
          })
          .then(response => {
            
            if (dataRef.current !== dataTmp) {
              
              return;
            }

            //updateOldData(response.entries)

            let responseRev = response.entries.map(x => x.rev).filter(y => y !== undefined)
            let oldrespRev = oldData.map(x => x.rev).filter(y => y !== undefined)
            let responseName = response.entries.map(x => x.name).filter(y => y !== undefined)
            let oldrespName = oldData.map(x => x.name).filter(y => y !== undefined)

            const diffRev = responseRev.filter(el => !oldrespRev.includes(el));
            const diffName = responseName.filter(el => !oldrespName.includes(el))


            
            if(response.entries.length < oldData.length){
              
              updateThumbnails([])
              updateData(response.entries)
              
            }


            if(response.entries.length !== oldData.length || diffRev.length > 0 || diffName.length > 0){
         
              updatePollMode(true)
              console.log('poll körs folder')
              console.log('poll stoppas tillfälligt folder')

              getThumbnails(dbx, response.entries)


               .then(entries => {
                updateData(response.entries)
                updateOldData(response.entries)
                updateThumbnails(entries)
                
              })
              .then(rep => {
                updatePollMode(false)
                console.log('Poll startar igen folder')
              })
              
              .catch(function(error) {
                errorFunction(error, updateErrorMessage)
                console.log('Home Poll folder 218');
               });
              }
              else{
                console.log('Poll har inte körts för folder')
                return;
              }

          })
        
          .catch(function(error) {
            errorFunction(error, updateErrorMessage)
            console.log('Home Poll interval 230');
           });
        }
      }, 5000);
      
      
    
    return () => clearInterval(poll);

    }, [data, oldData, props.location.pathname, pollMode]) 



    
  useEffect(() => {
    
    
    if(!clearSearch){
      return;
    }

    console.log('render Home')
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



        console.log('bilder börjar hämtas')
          updateData(response.entries)
          updateOldData(response.entries)

        getThumbnails(dbx, response.entries)
        
        .then(entries => {  
          if (response.entries !== dataRef.current) {
            return;
          }
          
          console.log('bilder klara')
            updateThumbnails(entries)
            
          })
          .catch(function(error) {
            errorFunction(error, updateErrorMessage)
            console.log('Home filesrequest folder 278');
           });
           

      })
      
      .catch(function(error) {
        errorFunction(error, updateErrorMessage)
            console.log('Home Update Poll 286');
       });

     
    }
    else{
      
      let newFolder = props.location.pathname;
      newFolder = newFolder.substring(5)

      console.log("FETCH");

      dbx.filesListFolder({
        path: newFolder,
      
      })
      .then(response => {
        
        
        
        updateThumbnails([]);
        updateData(response.entries)
        updateOldData(response.entries)


        console.log(response.entries.length)
       console.log('bilder börjar hämtas')
        getThumbnails(dbx, response.entries)
        
      
          .then(entries => { 
            if (response.entries !== dataRef.current) {
              return;
            }  
            console.log('bilder klara')
            updateThumbnails(entries)
         
            })
            
            .catch(function(error) {
              errorFunction(error, updateErrorMessage)
              console.log('Home Request newfolder 321');
             });

      })
      .catch(function(error) {
        errorFunction(error, updateErrorMessage)
        console.log('Home filesrequest 327');
       });
    }
      updateClearSearch(false)

  }, [props.location.pathname, clearSearch])


  const dataUpdate = (data) => {
    //updateOldData(data)
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

  const pollUpdateMode = (bool) => {
      updatePollMode(bool)
  }
  const upFavTok = (arr) => {
    updateFavoriteToken(arr)
  }

  const clearSearchUpdate = (bool) => {
    updateClearSearch(bool)


    
  }

  const linkToRoot = () => {
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    const dbx = new Dropbox(
      option,
    );

 
      dbx.filesListFolder({
        path: '',
      
      })
      .then(response => {



        console.log('bilder börjar hämtas')
          updateData(response.entries)
          updateOldData(response.entries)

        getThumbnails(dbx, response.entries)
        
        .then(entries => {  
          if (response.entries !== dataRef.current) {
            return;
          }
          
          console.log('bilder klara')
            updateThumbnails(entries)
            
          })
          .catch(function(error) {
            errorFunction(error, updateErrorMessage)
            console.log('Home filesrequest folder 278');
           });
           

      })
  
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
      <div className="header-logo-wrap"><Link to='/home' onClick={linkToRoot}><img id="header-logo" src={ require('../Img/Logo_mybox.png') } alt="My Box logo"/></Link> </div>
        <span className="headerContent">
          <Search updateErrorMessage={ updateErrorMessage } pollUpdateMode={pollUpdateMode} searchData={data} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} oldDataUpdate={oldDataUpdate} clearSearch={clearSearch} clearSearchUpdate={clearSearchUpdate} />
          <span><UserAccount updateErrorMessage={ updateErrorMessage }/></span>
          <span><LogOut updateTokenState={updateTokenState}/></span>
        </span>
    </header>
    <div className="mainWrapper">
      <aside className="leftSide">
        
        <div className="left-link-wrap"><UploadFile updateErrorMessage={ updateErrorMessage } folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} oldDataUpdate={oldDataUpdate} pollUpdateMode={pollUpdateMode}></UploadFile><br></br><br></br>
        <CreateFolder updateErrorMessage={ updateErrorMessage } folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} oldDataUpdate={oldDataUpdate} pollUpdateMode={pollUpdateMode}></CreateFolder></div>
      </aside>
      <main className="mainMain">
      <label onClick={() => updateClearSearch(true)}>
      <Breadcrumbs clearSearchUpdate={clearSearchUpdate}/><br /></label>
      <p style={{ color: 'red' }}> { errorMessage }</p>
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
             Ren
            </th>
            <th style={{ textAlign: 'center' }}>
             Mov 
            </th>
            <th style={{ textAlign: 'center' }}>
             Cop
            </th>
            <th style={{ textAlign: 'center' }}>
              Fav
            </th>
            <th style={{ textAlign: 'center' }}>
              Del
            </th>
            </tr>
          </thead>
          <tbody>
            <ListItems updateErrorMessage={ updateErrorMessage } favorites={favorites} favUpdate={favUpdate} thumbnailsLoaded={thumbnailsLoaded} folder={props.location.pathname} dataUpdate={dataUpdate} thumbnailUpdate={thumbnailUpdate} oldDataUpdate={oldDataUpdate} renderData={data} thumbnails={thumbnails} clearSearchUpdate={clearSearchUpdate} pollUpdateMode={pollUpdateMode}></ListItems>
          </tbody>
        </table>
      </main>
      <aside className="rightSide">
        <div className="aside"></div>
         <FavoriteList updateErrorMessage={ updateErrorMessage } upFavTok={upFavTok} data={data} />
      </aside>
    </div>
    </>
  )
}

export default Home;



