import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { withRouter } from 'react-router-dom';
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
import Card from 'react-bootstrap/Card'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { TextField, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core'

//Context Api
import { IsLocalContext } from '../Contexts/IsLocalContext';
import { UserIDContext } from '../Contexts/UserIDContext'



// const useStyles = makeStyles((theme) => ({
//     appBar: {
//         position: 'relative',
//         backgroundColor: 'darkgray',
//         textAlign: 'center'
//     },
//     title: {
//         flex: 1,
//         fontFamily: "'Heebo', sans-serif",
//         fontSize: '3.5vh'
//     },
//     button: {
//         margin: theme.spacing(1),
//     },
// }));

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

    const [open, setOpen] = useState(true);
    const [notifications, SetNotifications] = useState([])

    let apiNotifications = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Notifications/${userID}`
    if (isLocal) {
        apiNotifications = `http://localhost:56794/api/Notifications/1`
    }

    useEffect(() => {
        (async function fetchMyAPI() {
            const res = await fetch(apiNotifications, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                }),
            })
            let data = await res.json();
            console.log(data)
            SetNotifications(data);
        }())
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    const ApproveProducat = (n) => {
    }

    const DeclineProducat = () => {

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
                        <div key={index} style={{ backgroundColor: !n.HasDone ? ' #f2f2f2' : 'white' }}>
                            <ListItem  style={{ textAlign: 'right' }}>
                                <ListItemAvatar style={{ marginRight: '5px' }}  >
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText dir='rtl'
                                primary={n.Title}
                                    secondary={
                                        <React.Fragment>
                                            במחיר של ₪{JSON.parse(n.DataObject).estimatedProductPrice *
                                            JSON.parse(n.DataObject).Quantity }
                                        </React.Fragment>
                                    }
                                    
                                />
                            </ListItem>
                            {n.TypeNot === 'AskProduct' && <span style={{marginRight:'30%'}} >
                                <Button variant="contained" className={classes.button} onClick={() => ApproveProducat(n)}
                                >
                                    אשר
                            </Button>
                            &nbsp;
                                <Button variant="contained" className={classes.button} onClick={() => DeclineProducat(n)}
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