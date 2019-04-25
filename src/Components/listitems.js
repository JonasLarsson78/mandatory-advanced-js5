import React, {useState} from 'react';

const ListItems = (props) => {
  console.log(props.listData)
  const data = props.listData

  const renderList = (data) => {
    return(
      <li key={data.id}>{data.name}</li>
    )
  }

  const listData = data.map(renderList)

 
  

  return(
    <>
      {listData}
    </>
  )
}

export default ListItems;