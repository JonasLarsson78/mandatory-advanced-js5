import React from 'react';
import { NavLink } from "react-router-dom";
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'

const Breadcrumbs = withBreadcrumbs([{ path: '/', breadcrumb: null }])(({ breadcrumbs }) => (

    <React.Fragment>
      {breadcrumbs.map(({
        match,
        breadcrumb,
      }) => (
        <span key={match.url}>
          <NavLink to={match.url}>{breadcrumb} ></NavLink>
        </span>
      ))}
    </React.Fragment>
  ));
  
export default Breadcrumbs;
