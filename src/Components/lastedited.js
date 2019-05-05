import moment from 'moment';
import React from 'react';

export function lastEdited (date) {
   
  const year = date.substring(0, 4);
  let month = date.substring(5, 7)
  let day = date.substring(8, 10)
  //const hour = date.substring(11, 13)
  //const minute = date.substring(14, 16)
  //const second = date.substring(17, 19)


  const months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  
  month = month.replace(/^0+/, '');
  day = day.replace(/^0+/, '')
  let monthInText = months[month-1];
  

  return <label>{'Last edited: ' + moment(date).fromNow() + ', ' + day + ' ' + monthInText + ' ' + year}</label>
}