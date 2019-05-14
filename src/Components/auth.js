import React, {useEffect, useState} from 'react';
import { updateToken } from './store.js'
import { Helmet } from "react-helmet";
import { Link, Redirect}from "react-router-dom";
import '../Css/auth.css';


const Auth = () => {
  const [isLoggedIn, updateIsLoggedIn] = useState(false)
  const [error, errorUpdate] = useState(false)
  
  useEffect(() => {
    console.log('render Auth')
    const hash = window.location.hash
    let errorHash = "#error_description=The+user+chose+not+to+give+your+app+access+to+their+Dropbox+account.&error=access_denied";
    if (hash === errorHash){
      errorUpdate(true)
      return
    }
    
    const regex = /#(?:access_token)=([\S\s]*?)&/
    const token = hash.match(regex)[1];

    updateToken(token);
    updateIsLoggedIn(true)
  
  }, [])
  if (error){
    return(
      <>
      <Helmet>
      <title>MyBOX Auth</title>
      </Helmet>
      <div className="authMainLoader">
        <div className="authProgress">
          <b><p>No access.<br/>Reload page.</p></b>
          <Link to="/"><button className="modalBtn">Reload</button></Link>
    </div>
   </div>
   </>
    )
  }
  
    if(isLoggedIn){
          return  <Redirect to={{pathname:"/home", state: {isLoggedIn: isLoggedIn}}} />
    }
  return(
    <>
    <Helmet>
      <title>MyBOX Auth</title>
    </Helmet>
   <div className="authMainLoader">
    <div className="authProgress">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        <p>Loading page...</p>
    </div>
   </div>
   </>
  )
  
}

export default Auth;