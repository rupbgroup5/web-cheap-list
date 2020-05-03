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
import { withRouter, useParams, useHistory } from 'react-router-dom' //,useLocation

//Styles
import '../Styles/HomeStyle.css'

//Our Components
import ListItem from '../Components/ListItem'
import ItemContent from '../Components/ItemContent'
import FormDialog from '../Components/FormDialog'
import AuthenticateContact from '../Components/AuthenticateContact'

//Context Api:
import { GroupDetailsContext } from '../Contexts/GroupDetailsContext'

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
  const { SetGroupDetails } = useContext(GroupDetailsContext);


  let { userIDfromRN } = useParams();
  //const location = useLocation()
  const classes = useStyles();
  const [groups, SetGroups] = useState([]);
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();
  const isLocal = true
  var apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups/"


  if (isLocal) {
    apiAppGroups = "http://localhost:56794/api/AppGroups/"
    userIDfromRN = 1
  }

  useEffect(() => {
    //alert('hello from Rn ' + userIDfromRN);
    //http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd
    (async function fetchMyAPI() {
      const res = await fetch(`http://localhost:56794/api/AppGroups/${userIDfromRN}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
      })
      let data = await res.json();
      console.log('data', data)
      SetGroups(data)
    }());
    localStorage.clear('list')
  }, [userIDfromRN]);

  const AddNewGroup = async (groupName, participiants) => {
    let participiantsArr = []
    for (let i = 0; i < participiants.length; i++) {
      let newParticipiant = await AuthenticateContact(participiants[i].PhoneNumber)
      console.log('new', newParticipiant)
      await participiantsArr.push(newParticipiant)
      console.log('arr', participiantsArr)
    }
    console.log('name', groupName)

    let newGroup = {
      GroupName: groupName,
      UserID: userIDfromRN,
      Participiants: participiantsArr
    };
    console.log('group', newGroup)

    fetch(apiAppGroups, {
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
          console.log(result)
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
        console.log('str', str)
      }
      return str;
    }
    
  






  return (

    <div className="container">
      <div className="header">
        <h1>הקבוצות שלי</h1>
      </div>
      {console.log(groups)}
      <div className="Maincontent"  >
        {
          groups.map((g, index) =>
            <span key={index} onClick={() => GetIntoGroup(index)} >
              <SwipeableList className={classes.root} threshold={0.25} >
                <SwipeableListItem
                  swipeRight={SwipeRightContent(g.GroupID, index)}
                  onSwipeProgress={handleSwipeProgress}
                >
                  <ListItemAvatar style={{ marginRight: '5px' }} >
                    <Badge badgeContent={10} color="secondary"  >
                      <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </Badge>
                  </ListItemAvatar>
                  <ListItem name={g.GroupName} description={GetParticipiants(g)} />
                </SwipeableListItem>
              </SwipeableList>

            </span>
          )
        }
      </div>
      <div className="footer">
        <FormDialog getData={AddNewGroup} userID={userIDfromRN} headLine={'יצירת קבוצה'} label={'שם הקבוצה'} />
      </div>

    </div>

  );

}


export default withRouter(HomePage)

