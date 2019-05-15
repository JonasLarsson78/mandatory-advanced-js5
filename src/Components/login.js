import React from 'react';
import { Dropbox } from 'dropbox';
import { Helmet } from "react-helmet";
import '../Css/login.css';
const appkey =  'bvtwa87o7e9bfk6';



const Login = () => {
  window.location.pathname = ""

const dbx = new Dropbox({
  clientId: appkey,
  fetch: fetch,
})

  
  return(
    <>
    <Helmet>
      <title>MyBOX Connect</title>
    </Helmet>
    <p className="loginText-big">The World number 1 box solution</p>
    <p className="loginText-small">Get control of your files in the cloud. Move, copy, upload and download files and have your personally favorites. Explore the App now!</p>
    <div className="loginMain">
      <a className="loginLink" href={dbx.getAuthenticationUrl('https://jonaslarsson78.github.io/mandatory-advanced-js5/auth')}><button className="loginBtn">Connect</button></a>
    </div>
    </>
  )
}

export default Login;