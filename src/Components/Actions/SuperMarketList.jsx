import React, { useState, useEffect, useContext, forwardRef } from 'react' //,useContext
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
//import { ProductsCartContext } from "../../Contexts/ProductsCartContext"
import { SMmoduleContext } from '../../Contexts/SMmoduleContext'
import * as userActions from '../../Contexts/Reducers/ActionTypes';

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
  const [productCart_SMLonly, SetProductCart_SMLonly] = useState([]); //must be empty array first !
  const [myCartBadge, SetmyCartBadge] = useState();
  const [notTakenBadge, SetNotTakenBadge] = useState();
  const { smList, smListdispatch } = useContext(SMmoduleContext);

  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(true);
  const [swipeProgress, handleSwipeProgress] = useState();
  const clicked = true;

  //-------------------------------------------------------------
  //-------------------------TEMP-------------------------------- 
  // const { productCart } = useContext(ProductsCartContext);
  //↓↓ -- ↑↑
  //temporary productCart that is not came from Alist just for construction time:


  const [productCart] = useState([
    {
      product_description: "מלפפונים בחומץ"
    },
    {
      product_description: "תפוחים"
    }, {
      product_description: "לחם"
    },
    {
      product_description: "חומוס"
    },
    {
      product_description: "חלב"
    },
    {
      product_description: " גבינה לבנה 5%"
    },
    {
      product_description: "מרגרינה"
    },
    {
      product_description: "זיתים"
    },
    {
      product_description: "ביצים"
    },
    {
      product_description: "שמן זית"
    },
    {
      product_description: "גבינה צהובה"
    },
    {
      product_description: "תפוחים"
    },
    {
      product_description: "גיל"
    },
    {
      product_description: "יוגורט"
    },
    {
      product_description: "אבטיח"
    }
  ]);
  //-------------------------TEMP-------------------------------- 
  //-------------------------------------------------------------

  useEffect(() => {
    (()=>{
      productCart.forEach((p) => {
        smListdispatch({ type: userActions.AddItem, newItem: { name: p.product_description } });
      });
      console.log('done filling');
    })();
  }, []);


  // useEffect(() => {
  //   //when fixing issues take care to take from the context api the names of products only and
  //   //not the whole json (product.product_description)
  //   if (localStorage.getItem('SuperMarketList')) { //if the ls is full with something under this key
  //     SetProductCart_SMLonly(JSON.parse(localStorage.getItem('SuperMarketList')));
  //   } else {
  //     SetProductCart_SMLonly(productCart);
  //     localStorage.setItem('SuperMarketList', JSON.stringify(productCart));
  //   }

  //   if (localStorage.getItem('MyCart')) {
  //     let LS_MyCart = JSON.parse(localStorage.getItem('MyCart'));
  //     SetmyCartBadge(LS_MyCart.length);
  //   }

  //   if (localStorage.getItem('NotTaken')) {
  //     let LS_NotTaken = JSON.parse(localStorage.getItem('NotTaken'));
  //     SetNotTakenBadge(LS_NotTaken.length);
  //   }
  // }, [productCart]);

  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  }


  const MoveItem2MyCart = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {

      //delete item from rendered productCart_SMLonly
      productCart_SMLonly.splice(p.index, 1);
      SetProductCart_SMLonly([...productCart_SMLonly]);

      //delete item from LS_superMarketList
      let LS_superMarketList = JSON.parse(localStorage.getItem('SuperMarketList'));
      LS_superMarketList.splice(p.index, 1);
      localStorage.setItem('SuperMarketList', JSON.stringify(LS_superMarketList));

      //check if MyCart is exist
      let tempMyCart;
      if (localStorage.getItem('MyCart')) { //exist
        //then get it and push new item
        tempMyCart = JSON.parse(localStorage.getItem('MyCart'));
        tempMyCart.push(p.product);
      } else { //not exist
        //then create array with the item in it.
        tempMyCart = [p.product];
      }

      SetmyCartBadge(tempMyCart.length);
      //finnaly update MyCart key in local storage 
      localStorage.setItem('MyCart', JSON.stringify(tempMyCart));
    }

  }

  const MoveItem2NotTaken = (p) => {
    if (swipeProgress >= 70 || p.clicked === true) {

      //delete item from rendered productCart_SMLonly
      productCart_SMLonly.splice(p.index, 1);
      SetProductCart_SMLonly([...productCart_SMLonly]);

      //delete item from LS_superMarketList
      let LS_superMarketList = JSON.parse(localStorage.getItem('SuperMarketList'));
      LS_superMarketList.splice(p.index, 1);
      localStorage.setItem('SuperMarketList', JSON.stringify(LS_superMarketList));

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

      SetNotTakenBadge(tempNotTaken.length);
      //finnaly update NotTaken key in local storage 
      localStorage.setItem('NotTaken', JSON.stringify(tempNotTaken));

    }

  }


  const temp = () => {
    smListdispatch({ type: userActions.AddItem, newItem: { name: 'חלב' } });
    console.log(smList);
  }

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

          {smList.map((product, index) => {
            return (
              <SwipeableListItem
                key={index}
                swipeRight={{
                  content: <div className="swipeRight-divs">לא לקחתי</div>,
                  action: () => MoveItem2NotTaken({ product, index })
                }}
                swipeLeft={{
                  content: <div className="swipeLeft-divs">הכנס לעגלה שלי</div>,
                  action: () => MoveItem2MyCart({ product, index })
                }}
                onSwipeProgress={handleSwipeProgress}
              // threshold={0.25} cant understand what is it... Not helpful nor harmful
              >
                <div className="list-item">
                  <DeleteOutlineIcon onClick={() => MoveItem2NotTaken({ product, index, clicked })} id='OVerRide_MuiSvgIcon-root' />
                  <AddShoppingCartIcon onClick={() => MoveItem2MyCart({ product, index, clicked })} id='OVerRide_MuiSvgIcon-root' />
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
        <button onClick={temp}>temp</button>

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