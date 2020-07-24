import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//styles:
import './App.css'

//Our Components:
import MainNabar from './Components/MainNavBar'
import CCErrorMessage from './Components/CCErrorMessage'

//pages:
import HomePage from './Pages/HomePage'
import AGroup from './Pages/AGroup'
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
import SMmoduleContextProvider from './Contexts/SMmoduleContext';



import Temp from './Temp'








function App() {
  return (
    <div className="App">
      <CCErrorMessage> {/** THIS IS MUST BE THE FATHER OF ALL COMPONENTS */}

        <SMmoduleContextProvider>
          <IsLocalContextProvider>
            <PageTitleContextProvider>
              <UserIDContextProvider>
                <GroupDetailsContextProvider>
                  <ListDetailsContextProvider>
                    <ProductsCartContextProvider>
                      <MainNabar />
                      <Switch>
                        <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
                        <Route path="/HomePage/:userIDfromRN" component={HomePage} />

                        <Route path="/AGroups" component={AGroup} /> {/** /:groupID/:groupName/:userID */}
                        <Route path="/AList" component={AList} />
                        <Route path="/SuperMarketList" component={SuperMarketList} />
                        <Route path="/MyCart" component={MyCart} />
                        <Route path="/NotTaken" component={NotTaken} />
                        <Route path="/CCErrorMessage" component={CCErrorMessage} />
                        <Route path="/tempError">
                          <Temp heroName="Joker" />
                        </Route>
                      </Switch>
                    </ProductsCartContextProvider>
                  </ListDetailsContextProvider>
                </GroupDetailsContextProvider>
              </UserIDContextProvider>
            </PageTitleContextProvider>
          </IsLocalContextProvider>
        </SMmoduleContextProvider>

      </CCErrorMessage > {/** THIS IS MUST BE THE FATHER OF ALL COMPONENTS */}
    </div >
  );
}

export default withRouter(App);
