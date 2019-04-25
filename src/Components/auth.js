import React, {useEffect, useState} from 'react';
import { Dropbox } from 'dropbox';
import { updateToken } from './store.js'
import {token$} from './store.js';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";
import fetch from 'isomorphic-fetch';

const Auth = () => {
  const [isLoggedIn, updateIsLoggedIn] = useState(false)
  const [data, updateData] = useState(null);
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
      updateData(response)
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
      return  <Redirect to={{pathname:"/main", state: {data: data, isLoggedIn: isLoggedIn}}} />
      
    }
  return(
   
   <p>Loggar in...</p>
  )
}

export default Auth;