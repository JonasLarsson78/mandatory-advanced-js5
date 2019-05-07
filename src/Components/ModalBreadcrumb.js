import React from 'react';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import '../Css/breadcrumbs.css';
 
const ModalBreadcrumbs = ({ breadcrumbs }) => (
  <React.Fragment>
    {breadcrumbs.map(({ breadcrumb }) => breadcrumb)}
  </React.Fragment>
)
 
export default withBreadcrumbs()(ModalBreadcrumbs);
  