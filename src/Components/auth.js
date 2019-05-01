import React, {useEffect, useState} from 'react';
import { Dropbox } from 'dropbox';
import { updateToken } from './store.js'
import {token$} from './store.js';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import fetch from 'isomorphic-fetch';
import '../Css/auth.css';


const Auth = () => {
  const [isLoggedIn, updateIsLoggedIn] = useState(false)
  //const [data, updateData] = useState(null);
  const hash = window.location.hash
  const regex = /#(?:access_token)=([\S\s]*?)&/
  const token = hash.match(regex)[1];

  const getToken = () => {

    const option = {
      fetch: fetch,
      accessToken: token$.value
    };
    
    const dbx = new Dropbox(
      option,
    );
    dbx.filesListFolder({
      path: ''
    })
    .then(response => {
      //updateData(response)
      updateIsLoggedIn(true)
      
      
    })
    .catch(function(error) {
      console.log(error);
    });
  }

  

  useEffect(() => {
    
    updateToken(token);
    getToken();
  
  }, [token])

 
    if(isLoggedIn){

     
          return  <Redirect to={{pathname:"/main", state: {isLoggedIn: isLoggedIn}}} />
        


      
      
    }
  return(
   
   <div className="authMainLoader">
    <div className="authProgress">
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <p>Loading page...</p>
    </div>
   </div>
  )
}

export default Auth;