import React, { useState, useEffect, useContext } from 'react'
import { DeleteIcon } from '../Images/icons'


import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Badge } from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import swal from 'sweetalert'
import { withRouter, useParams, useHistory } from 'react-router-dom'


//Styles
import '../Styles/HomeStyle.css'

//Our Components
import ListItem from '../Components/ListItem'
import ItemContent from '../Components/ItemContent'
import FormDialog from '../Components/FormDialog'
import AuthenticateContact from '../Components/AuthenticateContact'
import Contacts from '../Components/Contacts'
import { SendPushAddToGroup } from '../Components/SendPush'

//Context Api:
import { GroupDetailsContext } from '../Contexts/GroupDetailsContext'
import { IsLocalContext } from '../Contexts/IsLocalContext'
import { UserIDContext } from '../Contexts/UserIDContext'
import { PageTitleContext } from "../Contexts/PageTitleContext";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
  },
  '& > *': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiBadge-root': {
    marginRight: theme.spacing(4),
  }

}));


function HomePage() {

  //Context Api:
  const { groupDeatils, SetGroupDetails } = useContext(GroupDetailsContext);
  const { isLocal } = useContext(IsLocalContext);
  const { userID,SetUserID,userName,SetUserName } = useContext(UserIDContext)
  const { SetPageTitle } = useContext(PageTitleContext);




  let { userIDfromRN } = useParams();
  if (userIDfromRN === undefined) {
    userIDfromRN = userID
  }
  
  const classes = useStyles();
  const [groups, SetGroups] = useState([]);
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();
  let apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups/"
  let apiAppUser = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppUsers/GetUser/${userIDfromRN}`
  const [enable, SetEnable] = useState(false);
  const [tempGroupName, SetTempGroupName] = useState();
  if (isLocal) {
    apiAppGroups = "http://localhost:56794/api/AppGroups/"
    apiAppUser = `http://localhost:56794/api/AppUsers/GetUser/${userIDfromRN}`
    userIDfromRN = 1
  }

  useEffect(() => {
    console.log(userName)
    if (!userName) {
      console.log(userName)
      try {
        (async function fetchMyAPI() {
          const res = await fetch(apiAppUser, {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
          })
          let data = await res.json();
          console.log(data)
          SetUserName(data.UserName)
         
  
        }());
      } catch (error) {
        console.log(error)
      }
    }
   
  }, []);


  useEffect(() => {
    
    document.body.style.backgroundSize = '50vh';

    try {
      (async function fetchMyAPI() {
        const res = await fetch(apiAppGroups + userIDfromRN, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
          }),
        })
        let data = await res.json();
        SetGroups(data);
        SetPageTitle('הקבוצות שלי');
        SetUserID(Number(userIDfromRN));
        localStorage.setItem('UserID', JSON.stringify(Number(userIDfromRN)))
      }());
    } catch (error) {
      console.log(error)
    }
  }, []);

  const AddNewGroup = async (participiants) => {

    let participiantsArr = [];


    for (let i = 0; i < participiants.length; i++) {
      let newParticipiant = await AuthenticateContact(participiants[i], userName)
      console.log(newParticipiant)
       participiantsArr.push(newParticipiant)
      console.log(participiantsArr)
    }

    for (let i = 0; i < participiantsArr.length; i++) {
      let notValidExpo = false;
      console.log(participiantsArr)
      notValidExpo = participiantsArr[i].ExpoToken === null || participiantsArr[i].ExpoToken === "";
      if (!notValidExpo) {
        SendPushAddToGroup(participiantsArr[i].ExpoToken, userName, tempGroupName)
      }
    }

    let newGroup = {
      GroupName: tempGroupName,
      UserID: userIDfromRN,
      Participiants: participiantsArr,
    };

    await fetch(apiAppGroups, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      }),
      body: JSON.stringify(newGroup)
    }).then(res => { return res.json(); })
      .then(
        (result) => {
          console.log('The ', result, ' was successfully added!')
          SetGroups([...groups, {
            ...result
          }])
        },
        (error) => {
          console.log(error)
        })

    console.log(groups)
  }

  const Delete = (id, index) => {
    if (swipeProgress >= 70) {
      swal({
        title: "מחיקת קבוצה",
        text: "!כל רשימות הקבוצה ימחקו גם הם",
        buttons: ['בטל', 'מחק'],
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            fetch(apiAppGroups + id, {
              method: 'DELETE',
              headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
              })
            }).then(res => { return res.json(); })
              .then(
                (result) => {
                  groups.splice(index, 1)
                  SetGroups([...groups])
                  SetUserName(userName)
                  console.log('The ', result, ' was successfully deleted!')
                  swal("הקבוצה נמחקה ")
                },
                (error) => {
                  console.log(error)
                })
          }
        })
    }
  }

  const SwipeRightContent = (id, index) => ({
    content: (
      <span style={{ background: 'red', width: '100%', direction: 'ltr' }}>
        <ItemContent
          icon={<DeleteIcon />}
          label="Delete"
          side="right"
        />
      </span>
    ),
    action: () =>
      triggerComplexItemAction(Delete(id, index))
  });

  const GetIntoGroup = (index) => {
    SetGroupDetails(groups[index]);
    history.push(`/AGroups`);

  }


  const GetParticipiants = (groups) => {
    let str = groups.Participiants[0].UserName;
    for (let i = 1; i < groups.Participiants.length; i++) {
      str += ', ' + groups.Participiants[i].UserName
    }
    return str;
  }

  const GetNameGroup = (groupName) => {
    SetTempGroupName(groupName);
    SetEnable(true);
  }

  const handleCloseListContact = (participiants) => {
    SetEnable(false);
    AddNewGroup(participiants);
  }

  return (

    <div className="container">
      {userName && <div className="header"> <b>שלום {userName} </b> </div>}
      <div className="Maincontent"  >
        {
          groups.map((g, index) =>
            <span key={index} onClick={() => GetIntoGroup(index)} >
              <SwipeableList className={classes.root} threshold={0.25}  >
                <SwipeableListItem style={{ background: 'black' }}
                  swipeRight={SwipeRightContent(g.GroupID, index)}
                  onSwipeProgress={handleSwipeProgress}
                >
                  <ListItemAvatar style={{ marginRight: '5px' }}  >
                    <Badge badgeContent={g.Badge} color="secondary"  >
                      <Avatar />
                    </Badge>
                  </ListItemAvatar>
                  <ListItem name={g.GroupName} description={GetParticipiants(g)} />
                </SwipeableListItem>
              </SwipeableList>

            </span>
          )
        }
        <br />
        {enable && <Contacts userID={userIDfromRN} groupName={tempGroupName} close={handleCloseListContact} style={{ textAlign: 'center' }} />}
      </div>
      <div className="footer">
        <FormDialog getData={GetNameGroup} headLine={'יצירת קבוצה'} label={'שם הקבוצה'} />
      </div>
    </div>

  );

}


export default withRouter(HomePage)

