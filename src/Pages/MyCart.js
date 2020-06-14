import React, { useState } from 'react' //, { useContext }
import { withRouter, useHistory } from 'react-router-dom'
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button'


//swipeable list:
import {
    SwipeableList,
    SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'





const MyCart = () => {
    const history = useHistory();
    //const { productCart } = useContext(ProductsCartContext); //SetProductCart
    const inCart = [
        "לחם",
        "חלב",
        "חומוס",
        " גבינה לבנה 5%",
        "ביצים",
        "שמן זית",
        "זיתים",
        "מרגרינה",

    ];

    const back2GroceriesList = () => {
        history.goBack();
    }
    return (
        <div>
            <h3 id="productCart-headline">העגלה שלי</h3>
            <div id="productCart-list">
                <SwipeableList>
                    {inCart.map((product, index) => {
                        return (
                            <SwipeableListItem key={index} swipeRight={{
                                content: <div className="swipe-divs">
                                    להחזיר לרשימת קניות
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
            <Button variant="contained" color="primary" onClick={back2GroceriesList}>חזרה לרשימה שלי</Button>

        </div>

    )
}

export default withRouter(MyCart);