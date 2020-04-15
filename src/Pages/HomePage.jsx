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
import { withRouter, useHistory } from 'react-router-dom';

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
  // let { id } = useParams();
  const classes = useStyles();
  const [group, SetGroup] = useState([]);
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const history = useHistory();

  useEffect(() => {

    async function fetchMyAPI() {
        const res = await fetch("http://localhost:56794/api/AppGroups", {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
          }),
        })
        let data = await res.json();
        SetGroup(data)
    }

    fetchMyAPI()
  },[]);

  const AddNewGroup = (name) => {
    SetGroup([...group, {
      GroupName: name
    }])
    let apiUrl = "http://localhost:56794/api/AppGroups/"
    let newGroup = {
      GroupName: name,
      CreatorName: 'Super-Girl'

    }

    fetch(apiUrl, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      }),
      body: JSON.stringify(newGroup)
    }).then(res => { return res.json(); })
      .then(
        (result) => {
          console.log('The ', result, ' was successfully added!')
        },
        (error) => {
          console.log(error)
        })
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
            let apiUrl = "http://localhost:56794/api/AppGroups/" + id;
            fetch(apiUrl, {
              method: 'DELETE',
              headers: new Headers({
                 'Content-type': 'application/json; charset=UTF-8' 
              })
            }).then(res => { return res.json(); })
              .then(
                (result) => {
                  group.splice(index, 1)
                  SetGroup([...group])
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

  const swipeRightDataComplex = (id, index) => ({
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


    const handleClickSL = (name,id) => {
      console.log('clicked ' + name);
      history.push(`/AGroup`, { name: name, id: id });
      console.log(history)
    }


    return (

      <div className="container">
        <div className="header">
          <h1>הקבוצות שלי</h1>
        </div>
        <div className="Maincontent"  >


          {
            group.map((g, index) =>
              <span key={index} onClick={() => handleClickSL(g.GroupName,g.GroupID)} >
                <SwipeableList className={classes.root} threshold={0.25} handleClickSL  >
                  <SwipeableListItem
                    swipeRight={swipeRightDataComplex(g.GroupID, index)}
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

