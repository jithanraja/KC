import './App.scss';
import { BrowserRouter as Router } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { Routes } from './configs/routes'
import { ToastContainer } from 'react-toastify';
import React from 'react';
import { connect } from 'react-redux';
import { Loader } from './shared';

function App(props) {

  return (
    <React.Fragment>
      <Router>
        {props.isLoading && <Loader />}
        <Routes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          newestOnTop={false}
          style={{width: 'auto'}}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return { isLoading : state.commonReducer.isLoading }
}


export default connect(mapStateToProps, null)(App);
