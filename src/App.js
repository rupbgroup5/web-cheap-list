import React from 'react';
import { Switch, Route, withRouter, useParams } from 'react-router-dom';

//styles:
import './App.css';

//Our Components:
import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import TempPage from './Pages/TempPage';
import Temp from './Pages/Temp2';

function App() {
  let { PrimeId } = useParams();

  return (
    <div className="App">
      <Navbar id={PrimeId} />
      <Switch>
        <Route exact path='/' component={Temp} />
        <Route path='/MyGroups/:id' component={HomePage} />
        <Route path="/TempPage/:id" component={TempPage} />

      </Switch>
    </div>
  );
}

export default withRouter(App);
