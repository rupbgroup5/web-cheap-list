import React, { useState, useEffect, useContext } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'

//swipeable list:
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'

//Context Api:
//import { ProductsCartContext } from "../Contexts/ProductsCartContext"





const SuperMarketList = (props) => {
  const history = useHistory();
        const [swipeProgress, handleSwipeProgress] = useState();

  //const { productCart } = useContext(ProductsCartContext); //SetProductCart

  //temporary productCart that is not came from Alist:
  const [productCart, SetProductCart] = useState([
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

// I think I going to use localstorge inorder to manage taken/non taken/supermarket list..
// tbc... TBD
  const Go2MyCart = () => {
    history.push("/MyCart")
  }

  const Move2takenList = (p) => {

    let product2move;

    if (swipeProgress >= 70) {
      let deleteMeIndex = productCart.indexOf(p);
      product2move = productCart.splice(deleteMeIndex, 1);
      SetProductCart([...productCart]);

      props.SendProduct(product2move)
    }

  }






  return (
    <div>
      <h3 id="productCart-headline">הרשימה שלי</h3>
      <div id="productCart-list">
        <SwipeableList>
          {productCart.map((product, index) => {
            return (
              <SwipeableListItem key={index}
                swipeRight={{
                  action: () => Move2takenList(product),
                  content: <div className="swipeRight-divs">
                    הכנס לעגלה שלי
              </div>,
                }}
                swipeLeft={{
                  content: <div className="swipeLeft-divs">
                    לא לקחתי
                </div>,
                  action: () => console.info('swipe action triggered')
                }}
                onSwipeProgress={handleSwipeProgress}
                threshold={0.25}
              >
                <div className="list-item" onClick={() => { alert("החלק אותי") }}>{index + 1 + ". " + product}</div>
              </SwipeableListItem>
            )
          })}

        </SwipeableList>
      </div>
      <div id="buttons-container">

        <Badge badgeContent={2} color="error">
          <Button variant="contained" color="primary" onClick={Go2MyCart}>העגלה שלי</Button>
        </Badge>
        <Badge badgeContent={4} color="error">
          <Button variant="contained" color="primary">לא לקחתי</Button>
        </Badge>

      </div>
    </div>

  )
}

export default withRouter(SuperMarketList);