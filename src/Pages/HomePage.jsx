import React, { useState, useEffect } from 'react'
import { DeleteIcon } from '../Images/icons'


import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Badge} from '@material-ui/core'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import swal from 'sweetalert'
import { withRouter,useParams, useHistory } from 'react-router-dom' //,useLocation 

//Styles
import '../Styles/HomeStyle.css'

//Our Components
import ListItem from '../Components/ListItem'
import ItemContent from '../Components/ItemContent'
import FormDialog from '../Components/FormDialog'


//Pages

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
  let { userIDfromRN} = useParams();
  //const location = useLocation()
  const classes = useStyles();
  const [groups, SetGroups] = useState([]);
  const [,triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();
  const isLocal = false
  var apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups/"

  if (isLocal){
    apiAppGroups =  "http://localhost:56794/api/AppGroups/"
  }

  useEffect(() => {
     alert('hello from Rn ' + userIDfromRN);
//http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd
    async function fetchMyAPI() {
        const res = await fetch( `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups/`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
          }),
        })
        let data = await res.json();
        SetGroups(data)
    }

    fetchMyAPI()
  },[userIDfromRN]);

  const AddNewGroup = (name) => {
    let newGroup = {
      GroupName: name,
      UserID:1
    }

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
            fetch(apiAppGroups + id , {
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
      let groupName = groups[index].GroupName;
      let groupID = groups[index].GroupID
      let userID = groups[index].UserID;
             
      history.push(`/AGroups/${groupID}/${groupName}/${userID}`);
     
    }
    return (
      <div className="container">
        <div className="header">
          <h1>הקבוצות שלי</h1>
        </div>
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
                    <ListItem name={g.GroupName} description="שמות הקבוצה יופיעו פה" />
                  </SwipeableListItem>
                </SwipeableList>

              </span>
            )
          }
        </div>
        <div className="footer">
          <FormDialog getData={AddNewGroup} headLine={'יצירת קבוצה'} label={'שם הקבוצה'} />
        </div>
       
      </div>
    
    );

  }


export default withRouter(HomePage)

