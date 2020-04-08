import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

//styles:
import './App.css';

//Our Components:
import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import TempPage from './Pages/TempPage';

function App() {


  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path='/'>
          <HomePage />
        </Route>
        <Route path='/tempPage'>
          <TempPage />
        </Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
