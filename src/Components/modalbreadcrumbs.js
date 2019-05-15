import React from 'react';
import { NavLink, Link } from "react-router-dom";
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import '../Css/breadcrumbs.css';

const ModalBreadcrumbs = withBreadcrumbs([{ path: '/', breadcrumb: null }])(({ breadcrumbs }) => (
    <>
    <i className="material-icons-outlined breadcrumb-home">home</i><Link className="breadcrumb-link" to="/">Home<i className="material-icons breadcrumb">arrow_right</i></Link>
    <React.Fragment>
      {breadcrumbs.map(({
        match,
        breadcrumb,
      }) => (
        
        <span key={match.url}>
          <NavLink to={match.url} className="breadcrumb-link"> {breadcrumb} 
          </NavLink><i className="material-icons breadcrumb">arrow_right</i>
        </span>
      ))}
    </React.Fragment>
    <br />
    </>
  ));
  
export default ModalBreadcrumbs;
  