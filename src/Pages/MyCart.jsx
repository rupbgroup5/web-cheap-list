import React, { useState, useEffect } from 'react' 
import { withRouter, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'
import {
    SwipeableList,
    SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'




const MyCart = () => {
    const history = useHistory();
    const [swipeProgress, handleSwipeProgress] = useState();
    const [inCartList, SetinCartList] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('MyCart')) { //if the ls is full with something under this key
            SetinCartList(JSON.parse(localStorage.getItem('MyCart')));
        } else {
            SetinCartList([]);
            localStorage.setItem('MyCart', JSON.stringify([]));
        }
    }, []);

    const MoveItem2NotTaken = (p) =>{
        if (swipeProgress >= 70) {
          
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

        if (swipeProgress >= 70) {
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

    return (
        <div>
            <h3 id="productCart-headline">העגלה שלי</h3>
            <div id="productCart-list">
                <SwipeableList>
                    {inCartList.map((product, index) => {
                        return (
                            <SwipeableListItem key={index}
                                swipeRight={{
                                    content: <div className="swipeRight-divs"> החזר לרשימת הקניות </div>,
                                    action: () => moveItemBack2SuperMarketList({ product, index })
                                }}
                                swipeLeft={{
                                    content: <div className="swipeLeft-divs">לא לקחתי</div>,
                                    action: () => MoveItem2NotTaken({ product, index })
                                }}
                                onSwipeProgress={handleSwipeProgress}
                                threshold={0.25}
                            >
                                <div className="list-item" onClick={() => { alert("החלק אותי") }}>{index + 1 + ". " + product}</div>
                            </SwipeableListItem>
                        )
                    })}

                </SwipeableList>
            </div> <br />
            <Button variant="contained" color="primary" onClick={()=> history.goBack()}>חזור לרשימת קניות</Button>

        </div>

    )
}

export default withRouter(MyCart);