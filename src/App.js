import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

//styles:
import './App.css';

//Our Components:
import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import TempPage from './Pages/TempPage';
import MyGroup from './Pages/MyGroup';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/MyGroup' component={MyGroup} />
        <Route path="/TempPage/:id" component={TempPage} />
      </Switch>

      

     
    </div>
  );
}

export default withRouter(App);
