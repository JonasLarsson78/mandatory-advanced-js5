import React from 'react';
import { Dropbox } from 'dropbox';
import '../Css/login.css';
const appkey =  'bvtwa87o7e9bfk6';



const Login = () => {

const dbx = new Dropbox({
  clientId: appkey,
  fetch: fetch,
})

const url = () =>{
  dbx.getAuthenticationUrl('http://localhost:3000/auth');
} 
  
  return(

    <>
    <div className="loginMain">
      <a className="loginLink" href={dbx.getAuthenticationUrl('http://localhost:3000/auth')}><button className="loginBtn">Connect</button></a>
    </div>
    </>
  )
}

export default Login;