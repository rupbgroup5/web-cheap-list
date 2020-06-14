import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//styles:
import './App.css'

//Our Components:
import Navbar from './Components/Navbar'
import MainNabar from './Components/MainNavBar'

//pages: 
import HomePage from './Pages/HomePage'
import AGroup from './Pages/AGroup'
import TempPage from './Pages/TempPage'
import AList from './Pages/AList'
import SuperMarketList from './Pages/SuperMarketList'
import MyCart from './Pages/MyCart'


//Contexts Providers:
import GroupDetailsContextProvider from './Contexts/GroupDetailsContext'
import ListDetailsContextProvider from './Contexts/ListDetailsContext'
import IsLocalContextProvider from './Contexts/IsLocalContext'
import ProductsCartContextProvider from './Contexts/ProductsCartContext'
import ListManagerContextProvider from './Contexts/ListManagerContext'


function App() {

  return (
    <div className="App">
      <IsLocalContextProvider>
        <GroupDetailsContextProvider>
          <ListDetailsContextProvider>
            <ProductsCartContextProvider>
              <MainNabar />
              <Navbar />
              <Switch>
                <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
                <Route path="/HomePage/:userIDfromRN" component={HomePage} />
                <Route path="/TempPage/:id" component={TempPage} />
                <Route path="/AGroups" component={AGroup} /> {/** /:groupID/:groupName/:userID */}
                <Route path="/AList" component={AList} />

                <ListManagerContextProvider>
                  <Route path="/SuperMarketList" component={SuperMarketList} />
                  <Route path="/MyCart" component={MyCart} />
                </ListManagerContextProvider>

              </Switch>
            </ProductsCartContextProvider>
          </ListDetailsContextProvider>
        </GroupDetailsContextProvider>
      </IsLocalContextProvider>
    </div>
  );
}

export default withRouter(App);
