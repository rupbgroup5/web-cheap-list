import React, { useState, useEffect } from 'react' 
import { withRouter, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import '../Styles/SuperMarketListStyle.css'
import {
    SwipeableList,
    SwipeableListItem
} from '@sandstreamdev/react-swipeable-list'
import '@sandstreamdev/react-swipeable-list/dist/styles.css'




const NotTaken = () => {
    const history = useHistory();
    const [swipeProgress, handleSwipeProgress] = useState();
    const [notTakenList, SetnotTakenList] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('NotTaken')) { //if the ls is full with something under this key
            SetnotTakenList(JSON.parse(localStorage.getItem('NotTaken')));
        } else {
            SetnotTakenList([]);
            localStorage.setItem('NotTaken', JSON.stringify([]));
        }
    }, []);

    const moveItemBack2SuperMarketList = (p) => {

        if (swipeProgress >= 70) {
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

    return (
        <div>
            <h3 id="productCart-headline">פריטים שלא לקחתי</h3>
            <div id="productCart-list">
                <SwipeableList>
                    {notTakenList
    .map((product, index) => {
                        return (
                            <SwipeableListItem key={index}
                                swipeRight={{
                                    action: () => moveItemBack2SuperMarketList({ product, index }),
                                    content: <div className="swipeRight-divs"> החזר לרשימת הקניות </div>,
                                }}
                                swipeLeft={{
                                    content: <div className="swipeLeft-divs">לא לקחתי</div>,
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
            </div> <br />
            <Button variant="outlined" color="primary" onClick={() => history.goBack()}>חזור לרשימת קניות</Button>

        </div>

    )
}

export default withRouter(NotTaken);