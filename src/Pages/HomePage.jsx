import React, { useState, useEffect } from 'react';
import { DeleteIcon } from '../Images/icons';


import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge} from '@material-ui/core';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import swal from 'sweetalert';
import { withRouter, useHistory,useParams } from 'react-router-dom';

//Styles
import '../Styles/HomeStyle.css';

//Our Components
import ListItem from '../Components/ListItem';
import ItemContent from '../Components/ItemContent';
import FormDialog from '../Components/FormDialog';


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
  let { id } = useParams();
  const classes = useStyles();
  const [groups, SetGroups] = useState([]);
  const [,triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();
  const isLocal = true
  var apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd/api/AppGroups/"

  if (isLocal){
    apiAppGroups =  "http://localhost:56794/api/AppGroups/"
  }

  useEffect(() => {
    alert(id + ' is here');

    async function fetchMyAPI() {
        const res = await fetch("http://localhost:56794/api/AppGroups/", {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
          }),
        })
        let data = await res.json();
        SetGroups(data)
    }

    fetchMyAPI()
  },[id]);

  const AddNewGroup = (name) => {
    let newGroup = {
      GroupName: name,
      CreatorName: 'OrelKarmi',
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
      history.push(`/AGroups`, { group: groups[index] });
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

