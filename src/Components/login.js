import React from 'react';
import { Dropbox } from 'dropbox';
import { Helmet } from "react-helmet";
import '../Css/login.css';
const appkey =  'bvtwa87o7e9bfk6';



const Login = () => {

const dbx = new Dropbox({
  clientId: appkey,
  fetch: fetch,
})

  
  return(
    <>
    <Helmet>
      <title>MyBOX Connect</title>
    </Helmet>
    <div className="loginMain">
      <a className="loginLink" href={dbx.getAuthenticationUrl('https://jonaslarsson78.github.io/mandatory-advanced-js5/auth')}><button className="loginBtn">Connect</button></a>
    </div>
    </>
  )
}

export default Login;