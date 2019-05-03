import React, {useState, useEffect, useRef} from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/userAccount.css';

const UserAccount = () => {
const photoRef = useRef(null);  
const [name, updateName] = useState("");
const [mail, updateMail] = useState("");
const [photoUrl, updatePhotUrl] = useState("");
const [country, updateCountry] = useState("us");


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
      updateName(response.name.display_name)
      updateMail(response.email)
      updatePhotUrl(response.profile_photo_url)
      updateCountry(response.country)
      
    })
    .catch(error => {
      console.log(error);
    });

   },[])

const onMouseOverPhoto = (e) => {
  photoRef.current.style.display = "block";
}
const onMouseOutPhoto = (e) => {
  photoRef.current.style.display = "none";
}

  let x = mail.lastIndexOf("@") + 1;
  let y = mail.substring(x);
  let url = "https://www." + y;
  let countryFlag = country.toLowerCase();

return(
  <div className="userMain">
  <div className="userFlag"><ReactCountryFlag code={countryFlag} svg /></div>
  <span className="userName">{name}</span>
  <span className="userMail"><a className="userMailAtag" href={url} target="_blank" without="true" rel="noopener noreferrer">( {mail} )</a></span>
  <img alt="userPhoto" onMouseOver={onMouseOverPhoto} onMouseOut={onMouseOutPhoto} className="userPhoto" src={photoUrl}/>
  <img alt="userPhotoBig" ref={photoRef} className="userPhotoBig" src={photoUrl}/>
  </div>
)

}
export default UserAccount;