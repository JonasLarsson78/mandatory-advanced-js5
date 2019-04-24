import React, {useEffect, useState} from 'react';
import { Dropbox } from 'dropbox';
import { updateToken } from './store.js'
import {token$} from './store.js';
import { BrowserRouter as Router, Route, Link, Redirect}from "react-router-dom";

const Auth = () => {

  const [isLoggedIn, updateIsLoggedIn] = useState(false)
  const [data, updateData] = useState(null);

  const hash = window.location.hash

  const regex = /#(?:access_token)=([\S\s]*?)&/
  const token = hash.match(regex)[1];

  useEffect(() => {

    updateToken(token);

    const dbx = new Dropbox({
      accessToken: token$.value,
      fetch
    });
    dbx.filesListFolder({
      path: ''
    })
    .then(response => {
      updateData(response)
       
      updateIsLoggedIn(true)
      
      
    })

  
  }, [token])

 
    if(isLoggedIn){
      return  <Redirect to={{pathname:"/main", state: {data: data}}} />
      
    }
  return(
   
   <p>Loggar in...</p>
  )
}

export default Auth;