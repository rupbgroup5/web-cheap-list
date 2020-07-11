import React, { useState, useEffect, forwardRef } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import ListIcon from '@material-ui/icons/List'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
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

const NotTaken = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [swipeProgress, handleSwipeProgress] = useState();
  const [notTakenList, SetnotTakenList] = useState([]);
  const clicked = true;

  useEffect(() => {
    if (localStorage.getItem('NotTaken')) { //if the ls is full with something under this key
      SetnotTakenList(JSON.parse(localStorage.getItem('NotTaken')));
    } else {
      SetnotTakenList([]);
      localStorage.setItem('NotTaken', JSON.stringify([]));
    }
  }, []);

  const moveItemBack2SuperMarketList = (p) => {

    if (swipeProgress >= 70 || p.clicked === true) {
      //delete item from rendered notTakenList
      notTakenList.splice(p.index, 1);
      SetnotTakenList([...notTakenList]);

      //delete item from LS_NotTaken
      let LS_NotTaken = JSON.parse(localStorage.getItem('NotTaken'));
      LS_NotTaken.splice(p.index, 1);
      localStorage.setItem('NotTaken', JSON.stringify(LS_NotTaken));

      //get SuperMarketList from ls, push item to temp array and update the ls SuperMarketList
      let tempSuperMarketList = JSON.parse(localStorage.getItem('SuperMarketList'));
      tempSuperMarketList.push(p.product);
      localStorage.setItem('SuperMarketList', JSON.stringify(tempSuperMarketList));

    }

  }

  const MoveItem2MyCart = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {

      //delete item from rendered productCart_SMLonly
      notTakenList.splice(p.index, 1);
      SetnotTakenList([...notTakenList]);

      //delete item from LS_NotTaken
      let LS_NotTaken = JSON.parse(localStorage.getItem('NotTaken'));
      LS_NotTaken.splice(p.index, 1);
      localStorage.setItem('NotTaken', JSON.stringify(LS_NotTaken));

      //check if MyCart is exist
      let tempMyCart;
      if (localStorage.getItem('MyCart')) { //exist
        //then get it and push new item
        tempMyCart = JSON.parse(localStorage.getItem('MyCart'));
        tempMyCart.push(p.product);
        //  SetmyCartBadge(tempMyCart.length);
      } else { //not exist
        //then create array with the item in it.
        tempMyCart = [p.product];
      }

      //finnaly update MyCart key in local storage 
      localStorage.setItem('MyCart', JSON.stringify(tempMyCart));
    }

  }

  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            לא לקחתי
          </Typography>
        </Toolbar>
      </AppBar>
      <div>
        <div id="productCart-list">
          <SwipeableList>
            {notTakenList
              .map((product, index) => {
                return (
                  <SwipeableListItem key={index}
                    swipeRight={{
                      content: <div className="swipeRight-divs"> החזר לרשימת הקניות </div>,
                      action: () => moveItemBack2SuperMarketList({ product, index })
                    }}
                    swipeLeft={{
                      content: <div className="swipeLeft-divs">התבלבלתי העבר לעגלה שלי</div>,
                      action: () => MoveItem2MyCart({ product, index })

                    }}
                    onSwipeProgress={handleSwipeProgress}
                  >
                    <div className="list-item">

                      <AddShoppingCartIcon onClick={() => MoveItem2MyCart({ product, index, clicked}) } id='OVerRide_MuiSvgIcon-root' />
                      <ListIcon onClick={() => moveItemBack2SuperMarketList({ product, index, clicked}) } id='OVerRide_MuiSvgIcon-root' />
                      <p className='product_description'>
                        {product}
                      </p>
                    </div>
                  </SwipeableListItem>
                )
              })}
          </SwipeableList>
        </div> <br />
        <div id="buttons-container">
          <Button variant="outlined" color="primary" onClick={() => history.push("/SuperMarketList")}>הרשימה שלי</Button>
          <Button variant="outlined" color="primary" onClick={() => history.push("/MyCart")}>העגלה שלי</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default withRouter(NotTaken);