import React, { useContext, useEffect, useState } from 'react'
import {withRouter,useParams} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useHistory } from 'react-router-dom';

import '../Styles/NavBarStyle.css'

import Logo from '../Images/Logo.png'

//ContextAPI
import { PageTitleContext } from "../Contexts/PageTitleContext";
import { UserIDContext } from '../Contexts/UserIDContext'
import { IsLocalContext } from '../Contexts/IsLocalContext';
import { NotificationsContext } from '../Contexts/NotificationsContext';
import { ListObjContext } from '../Contexts/ListDetailsContext'
import { GroupDetailsContext } from '../Contexts/GroupDetailsContext'





 function MainNabar() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory()

  //ContextAPI
  const { pageTitle } = useContext(PageTitleContext);
  const { userID, SetUserID } = useContext(UserIDContext)
  const { isLocal } = useContext(IsLocalContext);
  const {badge, Setbadge, notifications, SetNotifications } = useContext(NotificationsContext)
  const { listObj, SetListObj } = useContext(ListObjContext)
  const { groupDetails, SetGroupDetails } = useContext(GroupDetailsContext);
  
  const [data, SetData] = useState([])

  
  useEffect(() => {
      if (!groupDetails) {
        SetGroupDetails(JSON.parse(localStorage.getItem('groupDetails')))
        SetListObj(JSON.parse(localStorage.getItem('listObj')))
      }
      if (userID) {
        let apiNotifications = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/${userID}`
        if (isLocal) {
          apiNotifications = `http://localhost:56794/api/Notifications/${userID}`
        }
      
        let tempNot;
        if (pageTitle === 'הקבוצות שלי') {       
        (async function fetchMyAPI() {
        try {  
          const res = await fetch(apiNotifications, {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
          })
           let tempData = await res.json();
           SetData(tempData)
           console.log(data)
            tempNot = tempData.filter(x => x.GroupID === 0 && x.ListID === 0)
           console.log('tempNot', tempNot)
          SetNotifications(tempNot)
          Setbadge(tempNot.length)
          
        } catch (error) {
          console.log(error)
        }
        }())}else if(pageTitle === 'רשימות הקבוצה'){
           tempNot = data.filter(x => x.GroupID === groupDetails.GroupID && x.ListID === 0 )
         
          SetNotifications(tempNot)
          Setbadge(tempNot.length)
        } else{
             tempNot = data.filter(x => x.ListID === listObj.ListID )
            SetNotifications(tempNot)
            let tempBagde = tempNot.filter(item => item.HasRead === false)
            Setbadge(tempBagde.length)
          }
        }
      

  }, [pageTitle, userID]);


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const ReturnToHomePage = () => {
    if (userID === undefined) {
      let id = JSON.parse(localStorage.getItem('UserID'))
      console.log(id)
      SetUserID(id)
      history.push(`/HomePage/${id}`);
    }else history.push(`/HomePage/${userID}`);
  }

  return (
    <nav className="nav">
      <div className="nav-Logo">
        <img src={Logo} alt="" onClick={ReturnToHomePage} />
      </div>
      <span className="nav-title" style={{ paddingLeft : 50 }}>{pageTitle}</span>
      <div className="nav-Profile">
      <IconButton
       onClick={()=> history.goBack()}
      color="inherit"
      >
          <ArrowForwardIcon/>
        </IconButton>
        <IconButton
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={()=>{pageTitle === 'הקבוצות שלי' ? ReturnToHomePage() : history.goBack()}}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
   


      </div>

      {(pageTitle === 'סל קניות' || notifications.length !== 0) && <span className="nav-not" >
        <IconButton
          onClick={() => history.push('/Notifications')}
          color="inherit"
        >
          <Badge badgeContent={badge} color="secondary">
            <NotificationsNoneOutlinedIcon className={badge === 0 ? ' ' : "ring"} />
          </Badge>
        </IconButton>
      </span>}

    </nav>
  );

}

export default withRouter(MainNabar)