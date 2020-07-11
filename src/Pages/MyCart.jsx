import React, { useState, useEffect, forwardRef } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import ListIcon from '@material-ui/icons/List'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  }
  ,
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    fontSize: '8vh',
    fontFamily: 'Amatic SC',

  }
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MyCart = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [swipeProgress, handleSwipeProgress] = useState();
  const [inCartList, SetinCartList] = useState([]);
  const clicked = true;

  useEffect(() => {
    if (localStorage.getItem('MyCart')) { //if the ls is full with something under this key
      SetinCartList(JSON.parse(localStorage.getItem('MyCart')));
    } else {
      SetinCartList([]);
      localStorage.setItem('MyCart', JSON.stringify([]));
    }
  }, []);

  const MoveItem2NotTaken = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {

      //delete item from rendered inCartList
      inCartList.splice(p.index, 1);
      SetinCartList([...inCartList]);

      //delete item from LS_inCartList
      let LS_inCartList = JSON.parse(localStorage.getItem('MyCart'));
      LS_inCartList.splice(p.index, 1);
      localStorage.setItem('MyCart', JSON.stringify(LS_inCartList));

      //check if NotTaken is exist
      let tempNotTaken;
      if (localStorage.getItem('NotTaken')) { //exist
        //then get it and push new item
        tempNotTaken = JSON.parse(localStorage.getItem('NotTaken'));
        tempNotTaken.push(p.product);

      } else { //not exist
        //then create array with the item in it.
        tempNotTaken = [p.product];
      }

      //finnaly update NotTaken key in local storage 
      localStorage.setItem('NotTaken', JSON.stringify(tempNotTaken));

    }

  }


  const moveItemBack2SuperMarketList = (p) => {

    if (swipeProgress >= 70 || p.clicked === true) {
      //delete item from rendered inCartList
      inCartList.splice(p.index, 1);
      SetinCartList([...inCartList]);

      //delete item from LS_MyCart
      let LS_MyCart = JSON.parse(localStorage.getItem('MyCart'));
      LS_MyCart.splice(p.index, 1);
      localStorage.setItem('MyCart', JSON.stringify(LS_MyCart));

      //get SuperMarketList from ls, push item to temp array and update the ls SuperMarketList
      let tempSuperMarketList = JSON.parse(localStorage.getItem('SuperMarketList'));
      tempSuperMarketList.push(p.product);
      localStorage.setItem('SuperMarketList', JSON.stringify(tempSuperMarketList));

    }

  }
  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  }
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            העגלה שלי
          </Typography>
        </Toolbar>
      </AppBar>
        <div id="productCart-list">
          <SwipeableList>
            {inCartList.map((product, index) => {
              return (
                <SwipeableListItem key={index}
                  swipeRight={{
                    content: <div className="swipeRight-divs">לא לקחתי</div>,
                    action: () => MoveItem2NotTaken({ product, index })
                  }}
                  swipeLeft={{
                    content: <div className="swipeLeft-divs"> החזר לרשימת הקניות </div>,
                    action: () => moveItemBack2SuperMarketList({ product, index })
                  }}
                  onSwipeProgress={handleSwipeProgress}
                >
                  <div className="list-item">

<DeleteOutlineIcon onClick={() => MoveItem2NotTaken({ product, index, clicked}) } id='OVerRide_MuiSvgIcon-root'/>
<ListIcon onClick={() => moveItemBack2SuperMarketList({ product, index, clicked}) } id='OVerRide_MuiSvgIcon-root'/>
<p className='product_description'>
{product}
</p>
</div>
                </SwipeableListItem>
              )
            })}

          </SwipeableList>
        </div>
        <div id="buttons-container">
          <Button variant="outlined" color="primary" onClick={() => history.push("/SuperMarketList")}>הרשימה שלי</Button>
          <Button variant="outlined" color="primary" onClick={() => history.push("/NotTaken")}>לא לקחתי</Button>
        </div>
    </Dialog>

  )
}

export default withRouter(MyCart);