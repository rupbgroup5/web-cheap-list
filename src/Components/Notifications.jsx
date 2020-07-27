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


    const { notifications, SetNotifications } = useContext(NotificationsContext)

    const [open, setOpen] = useState(true);
    const history = useHistory()

    let apiAppProduct = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppProduct/"
    if (isLocal) {
        apiAppProduct = "http://localhost:56794/api/AppProduct/";
    }




    const handleClose = () => {
        setOpen(false);
        for (let i = 0; i < notifications.length; i++) {
           notifications[i].HasRead = true;
        }
        SetNotifications([...notifications])
        history.push('/AList')
    };

    const ApproveProducat = (p, index) => {
        Add2DB(p, index)
    }

    const DeclineProducat = () => {

    }

    const Add2DB = async (p, index) => {
        let product = {
            Quantity: p.Quantity,
            ...p,
            ListID: listObj.ListID,
            GroupID: listObj.GroupID,
            NotID: notifications[index].NotID
        }
        console.log(product)
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
        notifications.splice(index, 1)
        SetNotifications([...notifications])
        swal('המוצר התווסף בהצלחה')
    }



    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
            {console.log('notfa', notifications)}
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
                        <div key={index} style={{ backgroundColor: !n.HasDone ? ' #f2f2f2' : 'white' }}>
                            <ListItem style={{ textAlign: 'right' }}>
                                <ListItemAvatar style={{ marginRight: '5px' }}  >
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText dir='rtl'
                                    primary={n.Title}
                                    secondary={
                                        <React.Fragment>
                                            במחיר של ₪{JSON.parse(n.DataObject).estimatedProductPrice *
                                                JSON.parse(n.DataObject).Quantity}
                                        </React.Fragment>
                                    }

                                />
                            </ListItem>
                            {n.TypeNot === 'AskProduct' && <span style={{ marginRight: '30%' }} >
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
                        </div>
                    )
                })}
            </List>


        </Dialog>
    );
}
export default withRouter(Notifications);