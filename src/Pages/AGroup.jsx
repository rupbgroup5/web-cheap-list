

import React, { useState, useRef, useEffect, useContext } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { DeleteIcon } from '../Images/icons'

import { makeStyles, withStyles } from '@material-ui/core/styles'
import { Badge, IconButton, TextField } from '@material-ui/core'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import List from '@material-ui/core/List';


import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import swal from 'sweetalert'


//Styles
import '../Styles/HomeStyle.css'

//Our Components
import ListItem from '../Components/ListItem'
import ItemContent from '../Components/ItemContent'
import FormDialog from '../Components/FormDialog'
import { ChangeGroupNamePush } from '../Components/SendPush'


//Context Api:
import { GroupDetailsContext } from '../Contexts/GroupDetailsContext'
import { ListObjContext } from "../Contexts/ListDetailsContext";
import { IsLocalContext } from "../Contexts/IsLocalContext";
import { PageTitleContext } from "../Contexts/PageTitleContext";
import { IsAdminContext } from "../Contexts/IsAdminContext";



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
    margin: theme.spacing(1),
    width: '25ch',
  },
  '& .MuiBadge-root': {
    marginRight: theme.spacing(4),

  },

}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);


function AGroup() {
  const classes = useStyles();
  const history = useHistory();
  //Context Api:
  const { groupDetails, SetGroupDetails } = useContext(GroupDetailsContext);
  const { SetListObj } = useContext(ListObjContext);
  const { isLocal } = useContext(IsLocalContext);
  const { SetPageTitle } = useContext(PageTitleContext);
  const { isAdmin, SetIsAdmin } = useContext(IsAdminContext);



  const [lists, SetLists] = useState([]);
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const textInput = useRef(null);
  let tempName = "";
  let apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups/";
  let apiAppList = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppList/";
  if (isLocal) {
    apiAppGroups = "http://localhost:56794/api/AppGroups/";
    apiAppList = "http://localhost:56794/api/AppList/";
  }
  

  useEffect(() => {
    document.body.style.backgroundSize = '50vh' ;;
    (async function fetchMyAPI() {
      if (!groupDetails) {
        SetGroupDetails(JSON.parse(localStorage.getItem('groupDetails')))
        SetIsAdmin(JSON.parse(localStorage.getItem('isAdmin')))
      }
      if (groupDetails) {
        for (let i = 0; i < groupDetails.Participiants.length; i++) {
          if (groupDetails.Participiants[i].UserID === groupDetails.UserID) {
              if (groupDetails.Participiants[i].IsAdmin) {SetIsAdmin(true)
              } else { SetIsAdmin(false) }
          }
      }
        try {
          const res = await fetch(apiAppList + groupDetails.GroupID + 
            '/' + groupDetails.UserID , {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json; charset=UTF-8',
            }),
          })
          let data = await res.json();
          SetLists(data)
          localStorage.setItem('groupDetails', JSON.stringify(groupDetails));
          localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
        } catch (error) {
          console.log(error)
        }
      }

    })();
    SetPageTitle('רשימות הקבוצה')
  }, [groupDetails, apiAppList, SetPageTitle]);



  const AddNewList = (n) => {
    let newList = {
      ListName: n,
      GroupID: groupDetails.GroupID,
      UserID: groupDetails.UserID
    }
    fetch(apiAppList, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      }),
      body: JSON.stringify(newList)
    }).then(res => { return res.json(); })
      .then(
        (result) => {
          console.log('The ', result, ' was successfully added!')
          console.log('resultPostList', result)
          SetLists([...lists, {
            ...result
          }])
          console.log(lists)
        },
        (error) => {
          console.log(error)
        })
  }
  let Delete = (id, index) => {
    if (swipeProgress >= 70) {
      swal({
        title: "מחיקת רשימה",
        text: "כל פריטי הרשימה ימחקו גם הם ",
        buttons: ['בטל', 'מחק'],
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            fetch(apiAppList + id, {
              method: 'DELETE',
              headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
              })
            }).then(res => { return res.json(); })
              .then(
                (result) => {
                  console.log('The ', result, ' was successfully deleted!')
                  lists.splice(index, 1)
                  SetLists([...lists])
                  swal("הרשימה נמחקה ")
                },
                (error) => {
                  console.log(error)
                })
          }
        });
    }
  }

  const swipeRightDataComplex = (ListID, index) => ({
    content: (
      <span style={{ background: 'red', width: '100%', direction: 'ltr' }}>
        <ItemContent
          icon={<DeleteIcon />}
          side="right"
        />
      </span>
    ),
    action: () =>
      triggerComplexItemAction(Delete(ListID, index))
  });


  const GetIntoList = (index) => {

    SetListObj(lists[index]);
    history.push('/AList')

  }

  const editGroupName = (e) => {
    tempName = "";
    tempName = e.target.value
  }

  const ConfirmationEditGroupName = () => {
    let oldGroupName = groupDetails.GroupName
    if (tempName !== "") {
      swal({
        title: "שינוי שם קבוצה",
        buttons: ['התחרטתי', 'שנה את השם'],
        dangerMode: true,
      })
        .then((userInput) => {
          if (userInput) {
            console.log(tempName)
            let g = {
              GroupID: groupDetails.GroupID,
              GroupName: tempName
            }
            fetch(apiAppGroups, {
              method: 'PUT',
              headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
              }),
              body: JSON.stringify(g)
            }).then(res => { return res.json(); })
              .then(
                (result) => {
                  SetGroupDetails({ ...groupDetails, GroupName: tempName });
                  console.log('The name of ', result, ' id was changed')
                  swal('שם הקבוצה שונה');
                  let ArrUserTo = []
                  let userFrom;
                  for (let i = 0; i < groupDetails.Participiants.length; i++) {
                    if (groupDetails.UserID === groupDetails.Participiants[i].UserID) {
                      userFrom = groupDetails.Participiants[i]
                      continue;
                    }
                    if (groupDetails.Participiants[i].ExpoToken !== "") {
                      ArrUserTo.push(groupDetails.Participiants[i])
                    } 
                  }
                  console.log(ArrUserTo)
                  ChangeGroupNamePush(userFrom,ArrUserTo,oldGroupName,groupDetails.GroupName)
                },
                (error) => {
                  console.log(error)
                })
                
          } else {
            textInput.current.value = ""
          }
        })
    }
  }

  return (
    <span>
      {groupDetails && 
      <div className="container">
        {console.log(groupDetails)}
        <div className="header"  >
          <TextField
            id="outlined-basic"
            variant="outlined"
            onInput={editGroupName}
            placeholder={groupDetails && groupDetails.GroupName}
            onBlur={ConfirmationEditGroupName}
            inputRef={textInput}
          />
        </div>
        <div className="Maincontent">
          {
            lists.map((l, index) =>
              <span key={index} onClick={() => GetIntoList(index)}>
                {isAdmin &&<span>
                  <SwipeableList key={index} className={classes.root} threshold={0.25}>
                  <SwipeableListItem
                    swipeRight={swipeRightDataComplex(l.ListID, index)}
                    onSwipeProgress={handleSwipeProgress}>
                    <IconButton aria-label="cart">
                      <StyledBadge badgeContent={l.Badge} color="secondary">
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                    <ListItem name={l.ListName} description={`סך עלות משוערת: ${l.ListEstimatedPrice === 0.00 ? 0 : Number(l.ListEstimatedPrice).toFixed(2)}`} />
                  </SwipeableListItem>
                </SwipeableList>
                  </span>}
                  {!isAdmin && <List key={index} className={classes.root} style={{flexDirection:"row"}} >
                    <IconButton aria-label="cart">
                      <StyledBadge badgeContent={l.Badge} color="secondary">
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                    <ListItem name={l.ListName} description={`סך עלות משוערת: ${l.ListEstimatedPrice === 0.00 ? 0 : Number(l.ListEstimatedPrice).toFixed(2)}`} />
                    </List>}
              
              </span>
            )
          }
          <button onClick={()=> history.push('/GroupSetting')}>הגדרות</button>
        </div>

        {isAdmin && <div className="footer">
          <FormDialog getData={AddNewList} headLine={'יצירת רשימה'} label={'שם הרשימה'} />
        </div>}
      </div>}
    </span>
  );
};




export default withRouter(AGroup);