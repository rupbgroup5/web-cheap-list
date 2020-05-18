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


//Contexts Providers:
import GroupDetailsContextProvider from './Contexts/GroupDetailsContext'
import ListDetailsContextProvider from './Contexts/ListDetailsContext'
import IsLocalContextProvider from './Contexts/IsLocalContext'



function App() {

  return (
    <div className="App">
      <IsLocalContextProvider>
      <GroupDetailsContextProvider>
        <ListDetailsContextProvider>
          <Navbar />
          <Switch>
            <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
            <Route path="/HomePage/:userIDfromRN" component={HomePage} />
            <Route path="/TempPage/:id" component={TempPage} />
            <Route path="/AGroups" component={AGroup} /> {/** /:groupID/:groupName/:userID */}
            <Route path="/AList" component={AList} />
          </Switch>
        </ListDetailsContextProvider>
      </GroupDetailsContextProvider>
      </IsLocalContextProvider> 
    </div>
  );
}

export default withRouter(App);
