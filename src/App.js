import React from 'react';
import { Switch, Route, withRouter,useHistory } from 'react-router-dom';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

//styles:
import './App.css';

//Our Components:
// import Navbar from './Components/Navbar';

//pages: 
import HomePage from './Pages/HomePage';
import AGroups from './Pages/AGroups';
import TempPage from './Pages/TempPage';
import AList from './Pages/AList';


function App() {
  // let { PrimeId } = useParams();
  const history = useHistory();

  return (
    <div className="App">
      
      
      {/* <Navbar  />   */}
      <ArrowForwardIosIcon onClick={()=> history.goBack() } style={{fontSize:'1.5em',paddingLeft:'20px', float:'right'}}/>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/TempPage" component={TempPage} />
        <Route path="/AGroups" component={AGroups} />
        <Route path="/AList" component={AList} />
      </Switch>
     
    </div>
  );
}

export default withRouter(App);
