import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//styles:
import './App.css'

//Our Components:
import Navbar from './Components/Navbar'

//pages: 
import HomePage from './Pages/HomePage'
import AGroup from './Pages/AGroup'
import TempPage from './Pages/TempPage'
import AList from './Pages/AList'


function App() {

  //"homepage": "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd"
  return (
    <div className="App">

      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
        <Route path="/HomePage/:userIDfromRN" component={HomePage} />
        <Route path="/TempPage/:id" component={TempPage} />
        <Route path="/AGroups/:groupID/:groupName/:userID" component={AGroup} />
        <Route path="/AList" component={AList} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
