import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'

import swal from 'sweetalert'


//Context Api
import { IsLocalContext } from '../Contexts/IsLocalContext';
import { UserIDContext } from '../Contexts/UserIDContext';
import { NotificationsContext } from '../Contexts/NotificationsContext';
import { ListObjContext } from '../Contexts/ListDetailsContext'
import { ProductsCartContext } from "../Contexts/ProductsCartContext";
import { GroupDetailsContext } from '../Contexts/GroupDetailsContext'

import { ApproveRequest,DeclineRequest } from '../Components/SendPush'


const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: 'darkgray',
        textAlign: 'center'
    },
    title: {
        flex: 1,
        fontFamily: "'Heebo', sans-serif",
        fontSize: '3.5vh'
    },
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    button: {
        marginBottom: '15px',
        fontFamily: 'Assistant',
        maxHeight: 28
    },
    buttonAnswer: {
        marginBottom: '15px',
        marginTop: '5px',

        fontFamily: 'Assistant',
        maxHeight: 28
    },
    dialog: {
        color: 'black',
        textAlign: 'right',
        fontFamily: 'Tahoma',
    }
}));

const Transition = forwardRef((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});


const Notifications = (props) => {
    const classes = useStyles();

    //ContextApi
    const { isLocal } = useContext(IsLocalContext);
    const { userID } = useContext(UserIDContext)
    const { listObj } = useContext(ListObjContext);
    const { productCart, SetProductCart } = useContext(ProductsCartContext);
    const { groupDetails } = useContext(GroupDetailsContext)


    const { notifications, SetNotifications } = useContext(NotificationsContext)

    const [open, setOpen] = useState(true);
    const history = useHistory()

    let apiAppProduct = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppProduct/"
    let apiNotifications = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/`
    if (isLocal) {
        apiAppProduct = "http://localhost:56794/api/AppProduct/";
        apiNotifications = `http://localhost:56794/api/Notifications/`;
    }




    const handleClose = () => {
        setOpen(false);
        for (let i = 0; i < notifications.length; i++) {
            notifications[i].HasRead = true;
        }
        SetNotifications([...notifications])
        try {
            fetch(apiNotifications, {
                method: 'Put',
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8'
                }),
                body: JSON.stringify(notifications)
            })
            let tempNotifiactions = notifications.filter(item  => item.HasRead === 0 || item.TypeNot === 'AskProduct' )
            SetNotifications(tempNotifiactions)
        } catch (error) {
            console.log(error)
        }
        history.push('/AList')
    };

    const ApproveProducat = (p, index) => { Add2DB(p, index) }

    const DeclineProducat = (p, index) => {
        notifications[index].TypeNot = '';
        let tempUserTo = notifications[index].UserFrom
        let userFrom = {
            UserID: groupDetails.UserID,
            UserName: groupDetails.UserName
        }

        let userTo = groupDetails.Participiants.find(userTo => userTo.UserID === tempUserTo);
        swal('הבקשה סורבה')

        DeclineRequest (userFrom, userTo, groupDetails, listObj, JSON.stringify(p))
    }

    const Add2DB = async (p, index) => {
        if (productCart.some(person => person.product_barcode === p.product_barcode)) {
            swal({
                title: 'מוצר זה קיים בעגלה',
                text: "?האם תרצה להוסיף בכל זאת",
                buttons: ['בטל', 'הוסף'],
            }).then((willContinue) => {
                if (willContinue) {
                    let product = {
                        Quantity: p.Quantity,
                        ...p,
                        ListID: listObj.ListID,
                        GroupID: listObj.GroupID,
                        NotID: notifications[index].NotID
                    }
                    fetch(apiAppProduct + 'UpdateQuantity' + '/' + true, {
                        method: 'PUT',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        }),
                        body: JSON.stringify(product)
                    }).then(res => { return res.json(); })
                        .then(
                            (resultDB) => {
                                listObj.ListEstimatedPrice += p.estimatedProductPrice * resultDB.Quantity
                                let i = productCart.findIndex(x => x.product_barcode === p.product_barcode);
                                productCart[i].Quantity += resultDB.Quantity
                                productCart[i].EstimatedProductPrice += p.estimatedProductPrice * resultDB.Quantity
                                SetProductCart([...productCart])
                                let tempUserTo = notifications[index].UserFrom
                                notifications.splice(index, 1)
                                SetNotifications([...notifications])
                                swal('המוצר התווסף בהצלחה')
                                let userFrom = {
                                    UserID: groupDetails.UserID,
                                    UserName: groupDetails.UserName
                                }

                                let userTo = groupDetails.Participiants.find(userTo => userTo.UserID === tempUserTo);
                                ApproveRequest(userFrom, userTo, groupDetails, listObj, JSON.stringify(p))
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            })
        } else {
            let product = {
                Quantity: p.Quantity,
                ...p,
                ListID: listObj.ListID,
                GroupID: listObj.GroupID,
                NotID: notifications[index].NotID
            }
            try {
                const resDB = await fetch(apiAppProduct, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-type': 'application/json; charset=UTF-8'
                    }),
                    body: JSON.stringify(product)
                })
                const resultDB = await resDB.json()
                console.log('result', resultDB)
                listObj.ListEstimatedPrice += p.estimatedProductPrice * resultDB.Quantity
                SetProductCart([...productCart, resultDB])
                let tempUserTo = notifications[index].UserFrom
                console.log('tempUserTo', tempUserTo)
                notifications.splice(index, 1)
                SetNotifications([...notifications])
                swal('המוצר התווסף בהצלחה')
                let userFrom = {
                    UserID: groupDetails.UserID,
                    UserName: groupDetails.UserName
                }
                let userTo = groupDetails.Participiants.find(userTo => userTo.UserID === tempUserTo);
                console.log('userTo', userTo)
                ApproveRequest(userFrom, userTo, groupDetails, listObj, JSON.stringify(p))
            } catch (error) {
                console.log(error)
            }
        }






    }



    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >

            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        התראות
            </Typography>
                </Toolbar>
            </AppBar>
            <List className={classes.root} dir='rtl'>
                {notifications.map((n, index) => {
                    return (
                        <div key={index}>
                            {n.TypeNot === 'AskProduct' && <div  style={{ backgroundColor: !n.HasRead ? ' #f2f2f2' : 'white' }}>
                                <ListItem style={{ textAlign: 'right' }}>
                                    <ListItemAvatar style={{ marginRight: '5px' }}  >
                                        <Avatar />
                                    </ListItemAvatar>
                                    <ListItemText dir='rtl'
                                        primary={n.Title}
                                        secondary={
                                            <React.Fragment>
                                                {n.body}
                                            </React.Fragment>
                                        }

                                    />
                                </ListItem>
                                {<span style={{ marginRight: '30%' }} >
                                    <Button variant="contained" className={classes.button}
                                        onClick={() => ApproveProducat(JSON.parse(n.DataObject), index)}>
                                        אשר
                            </Button>
                            &nbsp;
                                <Button variant="contained" className={classes.button} onClick={() => DeclineProducat(n, index)}
                                    >
                                        דחה
                            </Button>
                                </span>}
                                <Divider />
                            </div>}
                            {n.TypeNot !== 'AskProduct' && <div  style={{ backgroundColor: !n.HasRead ? ' #f2f2f2' : 'white' }}>
                                <ListItem style={{ textAlign: 'right' }}>
                                    <ListItemAvatar style={{ marginRight: '5px' }}  >
                                        <Avatar />
                                    </ListItemAvatar>
                                    <ListItemText dir='rtl'
                                        primary={n.Title}
                                        secondary={
                                            <React.Fragment>
                                                {n.Body}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </div>}
                        </div>
                    )
                })}
            </List>


        </Dialog>
    );
}
export default withRouter(Notifications);