import React, { useState, useEffect } from 'react' //, { useContext }
import { withRouter, useHistory } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox'
import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'

//swipeable list:
import {
  SwipeableList,
  SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'


import '../Styles/SuperMarketListStyle.css'


//Context Api:
//import { ProductsCartContext } from "../Contexts/ProductsCartContext"


/** Yogev leaves Note to him self:
 * after connecting the ProductsCartContext to this component
 * the initial content of the list meneger will be ProductsCartContext.
 * 
 */

const SuperMarketList = () => {
  const history = useHistory();

  //const { productCart } = useContext(ProductsCartContext); //SetProductCart
  //temp:
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

  const superMarketArr = [];

  useEffect(() => {
    let superMarketItem = {
      name: String,
      list: String,
    }
    productCart.forEach((p) => {
      superMarketItem.name = p;
      superMarketItem.list = "supermarket-list";
    });

  }, [superMarketArr], [productCart]);

  const Go2MyCart = () => {
    history.push("/MyCart")
  }


  return (
    <div>
      <h3 id="productCart-headline">הרשימה שלי</h3>
      <div id="productCart-list">
        <SwipeableList>
          {productCart.map((product, index) => {
            return (
              <SwipeableListItem key={index} swipeRight={{
                content: <div className="swipe-divs">
                  לא לקחתי
              </div>,
                action: () => console.info('swipe action triggered')
              }}>
                <Checkbox
                  color="primary"
                />
                <div>{product}</div>
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