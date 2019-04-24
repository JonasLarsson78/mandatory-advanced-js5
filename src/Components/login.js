import React from 'react';
import { Dropbox } from 'dropbox';
const appkey =  'bvtwa87o7e9bfk6';



const Login = () => {

const dbx = new Dropbox({
  clientId: appkey,
})
  
  return(

    <>
      <a href={dbx.getAuthenticationUrl('http://localhost:3000/auth')}>Connect</a>
    </>
  )
}

export default Login;