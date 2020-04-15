

import React, { useState, useRef } from 'react';
import { DeleteIcon, SettingIcon } from '../Images/icons';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Badge, IconButton, TextField } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'


import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list';
import '@sandstreamdev/react-swipeable-list/dist/styles.css';
import swal from 'sweetalert';
import { withRouter, useLocation,useHistory } from 'react-router-dom';

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
  const groupName = location.state.name;
  const groupId = location.state.id;
  const [name, setName] = useState(groupName)
  const classes = useStyles();
  const [lists, AddList] = useState([]);
  const [, SetData] = useState();
  const [, triggerComplexItemAction] = useState();
  const [swipeProgress, handleSwipeProgress] = useState();
  const textInput = useRef(null)
  let tempName = ""





  const GetTheNewList = (n) => {
    AddList([...lists, {
      name: n
    }])
  }

  let Delete = index => {
    if (swipeProgress >= 70) {
      swal({
        title: "מחיקת רשימה",
        text: "כל פריטי הרשימה ימחקו גם הם ",
        buttons: ['בטל', 'מחק'],
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {
            lists.splice(index, 1);
            SetData(...lists);
            console.log('delete');
            swal("הרשימה נמחקה ")
          }
        });
    }
  }

  const swipeRightDataComplex = index => ({
    content: (
      <span style={{ background: 'red', width: '100%', direction: 'ltr' }}>
        <ItemContent
          icon={<DeleteIcon />}
          side="right"

        />
      </span>

    ),
    action: () =>
      triggerComplexItemAction(Delete(index))
  });

  let Setting = index => {
    if (swipeProgress >= 70) {
      swal("תיאור הרשימה ", {
        content: "input",
        className: "swal-input"

      })
        .then((value) => {
          lists[index].discrptionList = value;
          AddList([...lists])
          console.log(lists)

        });
    }

  }

  const swipeLeftDataComplex = index => ({
    content: (
      <span style={{ background: 'gray', width: '100%' }}>
        <ItemContent
          icon={<SettingIcon />}
          side="left"

        />
      </span>

    ),
    action: () =>
      triggerComplexItemAction(Setting(index))
  });

  const handleClickSL = (name) => {
    console.log('clicked ' + name);
    // history.push(`/AGroup`,{params:name});

  }



  const editTitle = (e) => {
    tempName = "";
    tempName = e.target.value
  }

  const accept = () => {
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
            let group = {
              GroupID : groupId,
              GroupName: tempName
            }
            let apiUrl = "http://localhost:56794/api/AppGroups" ;
            fetch(apiUrl, {
              method: 'PUT',
              headers: new Headers({
                  'Content-type': 'application/json; charset=UTF-8' 
              }),
              body: JSON.stringify(group)
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


  return (
    <div className="container">
      <div className="header"  >
        
        <TextField
          id="outlined-basic"
          variant="outlined"
          onInput={editTitle}
          placeholder={name}
          onBlur={accept}
          inputRef={textInput}
        />
        
      </div>
      <div className="Maincontent"   >
        {
          lists.map((l, index) =>
            <span key={index} onClick={() => handleClickSL(l.name)}>

              <SwipeableList key={index} className={classes.root} threshold={0.25}>
                <SwipeableListItem
                  swipeRight={swipeRightDataComplex(index)}
                  swipeLeft={swipeLeftDataComplex(index)}
                  onSwipeProgress={handleSwipeProgress}>
                  <IconButton aria-label="cart">
                    <StyledBadge badgeContent={4} color="secondary">
                      <ShoppingCartIcon />
                    </StyledBadge>
                  </IconButton>
                  <ListItem name={l.name} description={l.discrptionList} />
                </SwipeableListItem>
              </SwipeableList>

            </span>

          )
        }
      </div>
      <div className="footer">
        <FormDialog getData={GetTheNewList} headLine={'יצירת רשימה'} label={'שם הרשימה'} />
      </div>

    </div>
  );
};

export default withRouter(AGroup);