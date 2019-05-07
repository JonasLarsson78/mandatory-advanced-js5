import React from 'react';
import { updateToken, updateFavoriteToken } from './store.js'
import {token$} from './store.js';

const LogOut = (props) => {
    const logOut = () =>{
        updateToken(null);
        props.updateTokenState(token$.value);
        updateFavoriteToken(null);
    }

return(
    <>
    <button className="headerLogOutBtn" onClick={logOut}>LogOut</button>
    </>
)
  }
  export default LogOut;