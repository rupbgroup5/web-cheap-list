import React, { useState, useEffect, useContext, forwardRef } from 'react' 
import { withRouter, useHistory } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import '../../Styles/SuperMarketListStyle.css'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

//Context Api:
import { SMmoduleContext } from '../../Contexts/SMmoduleContext'
import { RemoveItem, AddItem } from '../../Contexts/Reducers/ActionTypes'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    fontSize: '6vh',
    fontFamily: 'Amatic SC',

  },
  box: {
    color: 'black'
  }
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

const SuperMarketList = (props) => {
  const [myCartBadge, SetmyCartBadge] = useState();
  const [notTakenBadge, SetNotTakenBadge] = useState();
  const { smList, smListdispatch,
          myCartList, MyCartListDispatch,
          notTakenList, NotTakenListDispatch } = useContext(SMmoduleContext);
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [swipeProgress, handleSwipeProgress] = useState();

 useEffect(() => {
  SetmyCartBadge(myCartList.length);
 }, [myCartList]);

 useEffect(() => {
  SetNotTakenBadge(notTakenList.length);
 }, [notTakenList]);

  const MoveItem2MyCart = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {
      smListdispatch({ type: RemoveItem , id2remove: p.id });
      MyCartListDispatch({type: AddItem, newItem: {name: p.name} });
    }
  }

  const MoveItem2NotTaken = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {
      smListdispatch({ type: RemoveItem , id2remove: p.id });
      NotTakenListDispatch({type: AddItem, newItem: {name: p.name} });
    }
  }

  const handleClose = () => { setOpen(false); props.CloseDialog() }

  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            ניהול רשימת סופר
          </Typography>
        </Toolbar>
      </AppBar>

      <div id="productCart-list" >
        <SwipeableList className={classes.box} style={{ background: 'blue' }}>

          {smList.map((product) => {
            return (
              <SwipeableListItem
                key={product.id}
                swipeRight={{
                  content: <div className="swipeRight-divs">לא לקחתי</div>,
                  action: () => MoveItem2NotTaken(product)
                }}
                swipeLeft={{
                  content: <div className="swipeLeft-divs">הכנס לעגלה שלי</div>,
                  action: () => MoveItem2MyCart(product)
                }}
                onSwipeProgress={handleSwipeProgress}
              // threshold={0.25} cant understand what is it... Not helpful nor harmful
              >
                <div className="list-item">
                  <DeleteOutlineIcon onClick={() => MoveItem2NotTaken({ ...product, clicked: true })} id='OVerRide_MuiSvgIcon-root' />
                  <AddShoppingCartIcon onClick={() => MoveItem2MyCart({ ...product, clicked: true })} id='OVerRide_MuiSvgIcon-root' />
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
        <Badge badgeContent={myCartBadge} color="error">
          <Button variant="outlined" color="primary" onClick={() => history.push("/MyCart")}>העגלה שלי</Button>
        </Badge>
        <Badge badgeContent={notTakenBadge} color="error">
          <Button variant="outlined" color="primary" onClick={() => history.push("/NotTaken")}>לא לקחתי</Button>
        </Badge>

      </div>
    </Dialog>





  )
}

export default withRouter(SuperMarketList);