import React from 'react';
import { Switch, Route, withRouter, useParams } from 'react-router-dom';

//styles:
import './App.css';

//Our Components:
import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import OnGroup from './Pages/OnGroup';
import TempPage from './Pages/TempPage';
import Temp from './Pages/Temp2';

function App() {
  let { PrimeId } = useParams();

  return (
    <div className="App">
      <Navbar id={PrimeId} />
      <Switch>
        <Route exact path='/' component={Temp} />
        <Route exact path='/HomePage/:id' component={HomePage} />
        <Route exact path="/TempPage/:id" component={TempPage} />
        {/* <Route path="/OnGroup/:id" component={OnGroup} /> */}
      </Switch>
    </div>
  );
}

export default withRouter(App);
