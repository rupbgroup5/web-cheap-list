//React
import React, { useState, forwardRef, useContext } from 'react'
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
import ListIcon from '@material-ui/icons/List'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

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
  const { notTakenList, NotTakenListDispatch,
          MyCartListDispatch, smListdispatch } = useContext(SMmoduleContext);


  const moveItemBack2SuperMarketList = (p) => {

    if (swipeProgress >= 70 || p.clicked === true) {
      NotTakenListDispatch({ type: RemoveItem , id2remove: p.id });
      smListdispatch({type: AddItem, newItem: {name: p.name} });
    }

  }

  const MoveItem2MyCart = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {
      NotTakenListDispatch({ type: RemoveItem , id2remove: p.id });
      MyCartListDispatch({type: AddItem, newItem: {name: p.name} });
    }

  }

  const handleClose = () => { setOpen(false); props.CloseDialog() }

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
            {notTakenList.map((product) => {
                return (
                  <SwipeableListItem key={product.id}
                    swipeRight={{
                      content: <div className="swipeRight-divs"> החזר לרשימת הקניות </div>,
                      action: () => moveItemBack2SuperMarketList(product)
                    }}
                    swipeLeft={{
                      content: <div className="swipeLeft-divs">התבלבלתי העבר לעגלה שלי</div>,
                      action: () => MoveItem2MyCart(product)

                    }}
                    onSwipeProgress={handleSwipeProgress}
                  >
                    <div className="list-item">

                      <AddShoppingCartIcon onClick={() => MoveItem2MyCart({ ...product, clicked: true }) } id='OVerRide_MuiSvgIcon-root' />
                      <ListIcon onClick={() => moveItemBack2SuperMarketList({  ...product, clicked: true }) } id='OVerRide_MuiSvgIcon-root' />
                      <p className='product_description'>
                        {product.name}
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