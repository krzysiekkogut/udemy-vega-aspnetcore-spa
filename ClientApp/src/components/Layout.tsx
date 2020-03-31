import * as React from 'react';
import { ToastContainer } from 'react-toastify';
import { Container } from 'reactstrap';
import NavMenu from './NavMenu';
import 'react-toastify/dist/ReactToastify.css';

export default (props: { children?: React.ReactNode }) => (
  <React.Fragment>
    <NavMenu />
    <Container>
      {props.children}
    </Container>
    <ToastContainer />
  </React.Fragment>
);
