import React from 'react';
import { Switch, Route, withRouter, useHistory, useParams } from 'react-router-dom'; //Router
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

//styles:
import './App.css';

//Our Components:
import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import AGroups from './Pages/AGroups';
import TempPage from './Pages/TempPage';
import AList from './Pages/AList';


function App() {
  const history = useHistory();
  const { param } = useParams();
  // "homepage": "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd"
  return (
    <div className="App">



      <Navbar id={param} />
      <ArrowForwardIosIcon onClick={() => history.goBack()} style={{ fontSize: '1.5em', paddingLeft: '20px', float: 'right' }} />
      <Switch>
        <Route exact path="/" component={HomePage} /> {/**makes the HomePage homepage even when the url clean */}
        <Route path="/HomePage/:id" component={HomePage} />
        <Route path="/TempPage/:id/:name" component={TempPage} />
        <Route path="/AGroups/:groupID/:groupName/:userID" component={AGroups} />
        <Route path="/AList" component={AList} />
      </Switch>
    </div>
  );
}

export default withRouter(App);
