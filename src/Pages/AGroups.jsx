

import React, { useState, useRef, useEffect } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import { DeleteIcon } from '../Images/icons';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Badge, IconButton, TextField } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'


import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import swal from 'sweetalert';


//Styles
import '../Styles/HomeStyle.css';

//Our Components
import ListItem from '../Components/ListItem';
import ItemContent from '../Components/ItemContent';
import FormDialog from '../Components/FormDialog';


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
  const history = useHistory();
  const location = useLocation();
  const group = location.state.group;
  const [groupName, setName] = useState(group.GroupName)
  const classes = useStyles();
  const [list, SetList] = useState([]);
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const [participants, set_participants] = useState(['אבי','בני',"צ'רלי"]);
  const textInput = useRef(null);
  let tempName = "";
  let isLocal = true;
  let apiAppGroups = "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd/api/AppGroups/";
  let apiAppList = "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd/api/AppList/";
  if (isLocal) {
    apiAppGroups = "http://localhost:56794/api/AppGroups/";
    apiAppList = "http://localhost:56794/api/AppList/";
  }

  async function fetchMyAPI(group) {

    const res = await fetch(`http://localhost:56794/api/AppList/${group.GroupID}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
    })
    let data = await res.json();
    SetList(data)
  }

  useEffect(() => {
    fetchMyAPI(group)
  }, [group]);

  const AddNewList = (n) => {
    let newList = {
      ListName: n,
      GroupID: group.GroupID,
      CreatorName: 'OrelKarmi',
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
          SetList([...list, {
           ...result,
           ListID:list.ListID
          }])
        
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
                  list.splice(index, 1)
                  SetList([...list])
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

  // let EditDiscription = index => {
  //   if (swipeProgress >= 70) {
  //     swal("תיאור הרשימה ", {
  //       content: "input",
  //       className: "swal-input"

  //     })
  //       .then((value) => {
  //         list[index].descriptionListList = value;
  //         SetList([...list])
  //         console.log(list)

  //       });
  //   }

  // }

  // const swipeLeftDataComplex = index => ({
  //   content: (
  //     <span style={{ background: '#7cd1f9', width: '100%' }}>
  //       <ItemContent
  //         label=' הוספת תיאור '
  //         side="left"

  //       />
  //     </span>

  //   ),
  //   action: () =>
  //     triggerComplexItemAction(EditDiscription(index))
  // });



  const handleClickSL = (index) => {
    history.push(`/AList`, { list: list[index] });

  }

  const editGroupName = (e) => {
    tempName = "";
    tempName = e.target.value
  }

  const Confirmation = () => {
    console.log(tempName)
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
              GroupID: group.GroupID,
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
                  setName(tempName)
                  console.log('The name of ', result, ' id was changed')
                  swal('שם הקבוצה שונה');
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

  const addParticipant = () =>{
    
    //open the users contact list and let him choose from there.
    
  }


  return (
    <div className="container">
      <div className="header"  >

        <TextField
          id="outlined-basic"
          variant="outlined"
          onInput={editGroupName}
          placeholder={groupName}
          onBlur={Confirmation}
          inputRef={textInput}
        />
        <button>הוסף משתמש</button>

      </div>
      <div className="Maincontent"   >
        {
          list.map((l, index) =>
            <span key={index} onClick={() => handleClickSL(index)}>
              <SwipeableList key={index} className={classes.root} threshold={0.25}>
                <SwipeableListItem
                  swipeRight={swipeRightDataComplex(l.ListID, index)}
                  onSwipeProgress={handleSwipeProgress}>
                  <IconButton aria-label="cart">
                    <StyledBadge badgeContent={4} color="secondary">
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                  <ListItem name={l.ListName} description={`סך עלות הרשימה : ${l.ListEstimatedPrice === 'undefined' ? 0 : l.ListEstimatedPrice}`} />
                </SwipeableListItem>
              </SwipeableList>

            </span>

          )
        }
      </div>
      <div className="footer">
        <FormDialog getData={AddNewList} headLine={'יצירת רשימה'} label={'שם הרשימה'} />
      </div>


      {/* #region yogev's addons start */}
        <div>
          <ul>
            <h3>שמות חברי הקבוצה</h3>
            {participants.map((p, index) => <li key={index}>{p}</li>
            )}
          </ul>
          <button onClick={addParticipant}>הוסף משתתף</button>
        </div>
    {/* #endregion yogev's addons end */}
    </div>
  );
};




export default withRouter(AGroup);