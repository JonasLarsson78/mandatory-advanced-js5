import React, {useState, useEffect, useRef} from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Dropbox } from 'dropbox';
import {token$} from './store.js';
import '../Css/userAccount.css';

const UserAccount = () => {
const photoRef = useRef(null);  
const [name, updateName] = useState("");
const [mail, updateMail] = useState("");
const [photoUrl, updatePhotUrl] = useState(null);
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
  let checkPhoto;
  if (!photoUrl){
    checkPhoto = 
    <>
    <img style={{border: "1px solid black"}} alt="userPhoto" onMouseOver={onMouseOverPhoto} onMouseOut={onMouseOutPhoto} className="userPhoto" src={ require("../Img/profile-img-none.png")}/>
    <img style={{border: "1px solid black"}} alt="userPhotoBig" ref={photoRef} className="userPhotoBig" src={ require("../Img/profile-img-none.png")}/>
    </>
  }
  else{
    checkPhoto = 
    <>
    <img style={{border: "1px solid black"}} alt="userPhoto" onMouseOver={onMouseOverPhoto} onMouseOut={onMouseOutPhoto} className="userPhoto" src={photoUrl}/>
    <img style={{border: "1px solid black"}} alt="userPhotoBig" ref={photoRef} className="userPhotoBig" src={photoUrl}/>
    </>
  }

  

return(
  <div className="userMain">
  <div className="userFlag"><ReactCountryFlag code={countryFlag} svg /></div>
  <span className="userName">{name}</span>  
  <span className="userMail"><a className="userMailAtag" href={url} target="_blank" without="true" rel="noopener noreferrer">( {mail} )</a></span>
  {checkPhoto}
  </div>
)

}
export default UserAccount;