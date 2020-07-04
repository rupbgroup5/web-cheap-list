import React, { useState, useEffect } from 'react' //,useContext
import { withRouter, useHistory } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'

//Context Api:
//import { ProductsCartContext } from "../Contexts/ProductsCartContext"

const SuperMarketList = () => {

  const history = useHistory();
  const [swipeProgress, handleSwipeProgress] = useState();


  //-------------------------------------------------------------
  //-------------------------TEMP-------------------------------- 
  //const { productCart } = useContext(ProductsCartContext); 
  //↓↓ -- ↑↑
  //temporary productCart that is not came from Alist just for construction time:
  const [ productCart ] = useState([
    "לחם",
    "חלב",
    "חומוס",
    " גבינה לבנה 5%",
    "ביצים",
    "שמן זית",
    "זיתים",
    "מרגרינה",
    "גבינה צהובה",
    "גיל",
    "יוגורט",
    "שוקלד",
    "אפרסקים",
    "תפוחים",
    "אבטיח",
    "קבבים",
    "אנטריקוט",
    "חזה עוף",
    "ירקות סנפרוסט לתנור",
    "תבלינים",
  ]);
  //-------------------------TEMP-------------------------------- 
  //-------------------------------------------------------------

  const [productCart_SMLonly, SetProductCart_SMLonly] = useState([]); //must be empty array first !
  const [myCartBadge, SetmyCartBadge] = useState();
  const [notTakenBadge, SetNotTakenBadge] = useState();

  useEffect(() => {
    if (localStorage.getItem('SuperMarketList')) { //if the ls is full with something under this key
      SetProductCart_SMLonly(JSON.parse(localStorage.getItem('SuperMarketList')));
    } else {
      SetProductCart_SMLonly(productCart);
      localStorage.setItem('SuperMarketList', JSON.stringify(productCart));
    }

    if (localStorage.getItem('MyCart')) {
      let LS_MyCart = JSON.parse(localStorage.getItem('MyCart'));
      SetmyCartBadge(LS_MyCart.length);
    }

    if (localStorage.getItem('NotTaken')) {
      let LS_NotTaken = JSON.parse(localStorage.getItem('NotTaken'));
      SetNotTakenBadge(LS_NotTaken.length);
    }
  }, []);
 
  const MoveItem2MyCart = (p) => {
    if (swipeProgress >= 70) {

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
        SetmyCartBadge(tempMyCart.length);
      } else { //not exist
        //then create array with the item in it.
        tempMyCart = [p.product];
      }

      //finnaly update MyCart key in local storage 
      localStorage.setItem('MyCart', JSON.stringify(tempMyCart));
    }

  }

  const MoveItem2NotTaken = (p) =>{
    if (swipeProgress >= 70) {
      
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
        SetNotTakenBadge(tempNotTaken.length);
      } else { //not exist
        //then create array with the item in it.
        tempNotTaken = [p.product];
      }

      //finnaly update NotTaken key in local storage 
      localStorage.setItem('NotTaken', JSON.stringify(tempNotTaken));

    }

  }

 
  return (
    <div>
      <h3 id="productCart-headline">הרשימה שלי</h3>
      <div id="productCart-list">
        <SwipeableList>
          {productCart_SMLonly.map((product, index) => {
            return (
              <SwipeableListItem key={index}
                swipeRight={{
                  content: <div className="swipeRight-divs">הכנס לעגלה שלי</div>,
                  action: () => MoveItem2MyCart({ product, index })
                }}
                swipeLeft={{
                  content: <div className="swipeLeft-divs">לא לקחתי</div>,
                  action: () => MoveItem2NotTaken({ product, index })
                }}
                onSwipeProgress={handleSwipeProgress}
                // threshold={0.25}
              >
                <div className="list-item" onClick={() => { alert("החלק אותי") }}>{index + 1 + ". " + product}</div>
              </SwipeableListItem>
            )
          })}

        </SwipeableList>
      </div>
      <div id="buttons-container">

        <Badge badgeContent={myCartBadge} color="error">
          <Button variant="contained" color="primary" onClick={() => history.push("/MyCart")}>העגלה שלי</Button>
        </Badge>
        <Badge badgeContent={notTakenBadge} color="error">
          <Button variant="contained" color="primary" onClick={() => history.push("/NotTaken")}>לא לקחתי</Button>
        </Badge>

      </div>
    </div>

  )
}

export default withRouter(SuperMarketList);