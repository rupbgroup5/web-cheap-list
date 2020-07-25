//react
import React, { useState, useContext, forwardRef } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import '../Styles/SuperMarketListStyle.css'

//swipeable-list
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'

//material-ui
import Button from '@material-ui/core/Button'
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

//context api
import { SMmoduleContext } from '../Contexts/SMmoduleContext'
import { RemoveItem, AddItem } from '../Contexts/Reducers/ActionTypes'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  }
  ,
  title: {
    flex: 1,
    fontFamily:"'Heebo', sans-serif",
    fontSize: '3.5vh'

  }
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const MyCart = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [swipeProgress, handleSwipeProgress] = useState();
  const { myCartList, MyCartListDispatch,
    NotTakenListDispatch, smListdispatch } = useContext(SMmoduleContext);


  const MoveItem2NotTaken = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {
      MyCartListDispatch({ type: RemoveItem, id2remove: p.id });
      NotTakenListDispatch({ type: AddItem, newItem: { name: p.name } });
    }
  }


  const moveItemBack2SuperMarketList = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {
      MyCartListDispatch({ type: RemoveItem, id2remove: p.id });
      smListdispatch({ type: AddItem, newItem: { name: p.name } });
    }
  }
  const handleClose = () => { setOpen(false); history.push('/AList') }
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
          {myCartList.map((product) => {
            return (
              <SwipeableListItem key={product.id}
                swipeRight={{
                  content: <div className="swipeRight-divs">לא לקחתי</div>,
                  action: () => MoveItem2NotTaken(product)
                }}
                swipeLeft={{
                  content: <div className="swipeLeft-divs"> החזר לרשימת הקניות </div>,
                  action: () => moveItemBack2SuperMarketList(product)
                }}
                onSwipeProgress={handleSwipeProgress}
              >
                <div className="list-item">

                  <DeleteOutlineIcon onClick={() => MoveItem2NotTaken({ ...product, clicked: true })} id='OVerRide_MuiSvgIcon-root' />
                  <ListIcon onClick={() => moveItemBack2SuperMarketList({ ...product, clicked: true })} id='OVerRide_MuiSvgIcon-root' />
                  <p className='product_description'>
                    {product.name}
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