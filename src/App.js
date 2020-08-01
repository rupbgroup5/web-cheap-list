import React from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'

//styles:
import './App.css'

//Our Components:
import MainNabar from './Components/MainNavBar'
import CCErrorMessage from './Components/CCErrorMessage'
import Notifications from './Components/Notifications'


//pages:
import HomePage from './Pages/HomePage'
import AGroup from './Pages/AGroup'
import AList from './Pages/AList'
import SuperMarketList from './Components/Actions/SuperMarketList'
import MyCart from './Pages/MyCart.jsx'
import NotTaken from './Pages/NotTaken'
import GroupSetting from './Pages/GroupSetting'
import UserProfile from './Pages/UserProfile'


//Contexts Providers:
import GroupDetailsContextProvider from './Contexts/GroupDetailsContext'
import ListDetailsContextProvider from './Contexts/ListDetailsContext'
import IsLocalContextProvider from './Contexts/IsLocalContext'
import ProductsCartContextProvider from './Contexts/ProductsCartContext'
import UserIDContextProvider from './Contexts/UserIDContext'
import PageTitleContextProvider from './Contexts/PageTitleContext'
import SMmoduleContextProvider from './Contexts/SMmoduleContext';
import IsAdminContextProvider from './Contexts/IsAdminContext'
import NotificationsContextProvider from './Contexts/NotificationsContext'













function App() {
  return (
    <div className="App">
      <CCErrorMessage> {/** THIS IS MUST BE THE FATHER OF ALL COMPONENTS */}
        <SMmoduleContextProvider>
          <IsLocalContextProvider>
            <PageTitleContextProvider>
              <UserIDContextProvider>
                <NotificationsContextProvider>
                <GroupDetailsContextProvider>
                  <IsAdminContextProvider>
                  <ListDetailsContextProvider>
                    <ProductsCartContextProvider>
                      <MainNabar />
                      <Switch>
                        <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
                        <Route path="/HomePage/:userIDfromRN" component={HomePage} />
                        <Route path="/AGroups" component={AGroup} /> 
                        <Route path="/GroupSetting" component={GroupSetting} />
                        <Route path="/AList" component={AList} />
                        <Route path="/SuperMarketList" component={SuperMarketList} />
                        <Route path="/MyCart" component={MyCart} />
                        <Route path="/NotTaken" component={NotTaken} />
                        <Route path="/CCErrorMessage" component={CCErrorMessage} />
                        <Route path ="/Notifications"  component={Notifications}/>
                        {/* <Route path ="/UserProfile" component={UserProfile}/> */}
                        <Route path ="/UserProfile/:userIDfromRN" component={UserProfile}/>
                      </Switch>
                    </ProductsCartContextProvider>
                  </ListDetailsContextProvider>
                  </IsAdminContextProvider>
                </GroupDetailsContextProvider>
                </NotificationsContextProvider>
              </UserIDContextProvider>
            </PageTitleContextProvider>
          </IsLocalContextProvider>
        </SMmoduleContextProvider>

      </CCErrorMessage > {/** THIS IS MUST BE THE FATHER OF ALL COMPONENTS */}
    </div >
  );
}

export default withRouter(App);
