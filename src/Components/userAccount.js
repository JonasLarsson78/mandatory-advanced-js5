import React, {useState, useEffect} from 'react';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/userAccount.css';

const UserAccount = () => {
const [name, updateName] = useState("");
const [mail, updateMail] = useState("");
const [photoUrl, updatePhotUrl] = useState("");


  useEffect(() => {
    const option = {
      fetch: fetch,
      accessToken: token$.value
    };

    const dbx = new Dropbox(
      option,
    );

    dbx.usersGetCurrentAccount(
    )
    .then(response => {
      console.log(response)
      updateName(response.name.display_name)
      updateMail(response.email)
      updatePhotUrl(response.profile_photo_url)
      
    })
    .catch(error => {
      console.log(error);
    });
    

   },[])
  

    

return(
  <div className="userMain">
  <span className="userName">{name}</span>
  <span className="userMail">({mail})</span>
  <img className="userPhoto" src={photoUrl}/>
  </div>
)


}
export default UserAccount;