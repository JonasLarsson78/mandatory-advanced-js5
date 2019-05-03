import React, {useState, useEffect} from 'react';
import ReactCountryFlag from "react-country-flag";
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/userAccount.css';

const UserAccount = () => {
const [name, updateName] = useState("");
const [mail, updateMail] = useState("");
const [photoUrl, updatePhotUrl] = useState("");
const [country, updateCountry] = useState("");


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
      updateCountry(response.locale)
      
    })
    .catch(error => {
      console.log(error);
    });
    

   },[])
  let x = mail.lastIndexOf("@") + 1;
  let y = mail.substring(x);
  let url = "https://www." + y;
  let flagCode = country.substring(3);
  console.log(url)

return(
  
  <div className="userMain">
  <div className="userFlag"><ReactCountryFlag code={flagCode} svg /></div>
  <span className="userName">{name}</span>
  <span className="userMail"><a className="userMailAtag" href={url} target="_blank">( {mail} )</a></span>
  <img className="userPhoto" src={photoUrl}/>
  </div>
)


}
export default UserAccount;