import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//styles:
import './App.css'

//Our Components:
// import Navbar from './Components/Navbar'
import MainNabar from './Components/MainNavBar'

//pages:
import HomePage from './Pages/HomePage'
import AGroup from './Pages/AGroup'
import TempPage from './Pages/TempPage'
import AList from './Pages/AList'
import SuperMarketList from './Components/Actions/SuperMarketList'
import MyCart from './Pages/MyCart.jsx'
import NotTaken from './Pages/NotTaken'


//Contexts Providers:
import GroupDetailsContextProvider from './Contexts/GroupDetailsContext'
import ListDetailsContextProvider from './Contexts/ListDetailsContext'
import IsLocalContextProvider from './Contexts/IsLocalContext'
import ProductsCartContextProvider from './Contexts/ProductsCartContext'
import UserIDContextProvider from './Contexts/UserIDContext'
import PageTitleContextProvider from './Contexts/PageTitleContext'










function App() {

  return (
    <div className="App">
      <IsLocalContextProvider>
        <PageTitleContextProvider>
        <UserIDContextProvider>
          <GroupDetailsContextProvider>
            <ListDetailsContextProvider>
              <ProductsCartContextProvider>
                <MainNabar />
                {/* <Navbar /> */}
                <Switch>
                  <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
                  <Route path="/HomePage/:userIDfromRN" component={HomePage} />
                  <Route path="/TempPage/:id" component={TempPage} />
                  <Route path="/AGroups" component={AGroup} /> {/** /:groupID/:groupName/:userID */}
                  <Route path="/AList" component={AList} />
                  <Route path="/SuperMarketList" component={SuperMarketList} />
                  <Route path="/MyCart" component={MyCart} />
                  <Route path="/NotTaken" component={NotTaken} />
                </Switch>
              </ProductsCartContextProvider>
            </ListDetailsContextProvider>
          </GroupDetailsContextProvider>
        </UserIDContextProvider>
        </PageTitleContextProvider>
      </IsLocalContextProvider>
    </div>
  );
}

export default withRouter(App);
