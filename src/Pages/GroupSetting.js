//React
import React, { forwardRef, useState, useRef, useContext } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

//our components
import Contacts from '../Components/Contacts'
import AuthenticateContact from '../Components/AuthenticateContact'

//context API
import { IsLocalContext } from '../Contexts/IsLocalContext'

//material-ui
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import { TextField } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import DeleteIcon from '@material-ui/icons/Delete'
import Button from '@material-ui/core/Button'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import InputAdornment from '@material-ui/core/InputAdornment'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'

//sweetalert
import swal from 'sweetalert'

//notificaion handle
import { SendPushIDeletedMySelf, SendPushRemovedByAdmin } from '../temp4pushYogi'





const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: 'darkgray',
        textAlign: 'center'
    }
    ,
    title: {
        flex: 1,
        fontSize: '8vh',
        fontFamily: 'Amatic SC',
    },
    root: {
        maxWidth: 752,
        textAlign: 'center',
    },
    ParticipiantsDiv: {
        backgroundColor: theme.palette.background.paper,
        height: '45vh',
        overflow: 'overlay',
    },
    listItemText: {
        textAlign: 'right',
        marginRight: '3vw',
    },
    secondaryTxt: {
        color: 'red',
        fontWeight: 'bold',
        margin: 0,
    },
    myButton: {
        margin: '0 2.5vw',
        marginTop: '5vw',
        color: 'white',
        width: '95vw',
    },
    myTxtFeild: {
        marginTop: '5vh',
    },
    PlusBtn: {
        marginLeft: '75vw',
    },
    myContactsList: {
        width: '100vw',
        position: 'absolute',
        zIndex: 1,
        bottom: '20vh',
        background: 'white',
        textAlign: 'center',
    },
    footer: {
        width: '100vw',
        height: '20vh',
        marginTop: '5vh',
    },

}));

const Transition = forwardRef((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});

const GroupSetting = () => {
    const { isLocal } = useContext(IsLocalContext);
    const classes = useStyles();
    const textInput = useRef(null);
    const history = useHistory();
    let tempName = "";
    const [open, setOpen] = useState(true);
    const [enableContacts, SetEnableContacts] = useState(false);
    const [group, SetGroup] = useState(
        localStorage.getItem('groupDetails') ?
            JSON.parse(localStorage.getItem('groupDetails')) :
            undefined
    );
    const loggedInUserId = JSON.parse(localStorage.getItem('UserID'));

    let adminUserId;
    group.Participiants.map((p) => {
        if (p.IsAdmin) {
            adminUserId = p.UserID;
            return;
        }
    });

    let api4EditGroupName;
    let api4DeleteGroup;
    let api4AddUsers2UserInGroup;
    let api4removeUserInGroup;
    if (isLocal) {
        const localPrefix = "http://localhost:56794/api/appGroups";
        api4EditGroupName = `${localPrefix}`;
        api4DeleteGroup = `${localPrefix}/${group.GroupID}`;
        api4AddUsers2UserInGroup = `${localPrefix}/AddUsers2UserInGroup`;
        api4removeUserInGroup = (userId, GroupId) => {
            return `${localPrefix}/RemoveUserFromGroup/${userId}/${GroupId}`;
        }
    } else { //global
        const globalPrefix = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups";
        api4EditGroupName = `${globalPrefix}`;
        api4DeleteGroup = `${globalPrefix}/${group.GroupID}`;
        api4AddUsers2UserInGroup = `${globalPrefix}/AddUsers2UserInGroup`;
        api4removeUserInGroup = (userId, GroupId) => {
            return `${globalPrefix}/RemoveUserFromGroup/${userId}/${GroupId}`;
        }
    }
    const editGroupName = (e) => {
        tempName = "";
        tempName = e.target.value
    }

    const ConfirmationEditGroupName = () => {
        if (tempName !== "") {
            swal({
                title: "שינוי שם קבוצה",
                buttons: ['התחרטתי', 'שנה את השם'],
                dangerMode: true,
            })
                .then((userInput) => {
                    if (userInput) {
                        let g = {
                            GroupID: group.GroupID,
                            GroupName: tempName
                        }
                        fetch(api4EditGroupName, {
                            method: 'PUT',
                            headers: new Headers({
                                'Content-type': 'application/json; charset=UTF-8'
                            }),
                            body: JSON.stringify(g)
                        }).then(res => { return res.json(); })
                            .then(
                                (result) => {
                                    SetGroup({ ...group, GroupName: tempName });
                                    swal('שם הקבוצה שונה');
                                },
                                (error) => {
                                    console.log(error)
                                })
                    } else {
                        textInput.current.value = ""
                    }
                })
        }
    }

    const HandleNotification4RemovedByAdmin = (userToId) => {

        let userTo = {
            UserID: userToId,
            ExpoToken: "",
        }

        let adminUser = {
            UserID: adminUserId,
            UserName: ""
        }
        group.Participiants.forEach(p => {
            if (p.UserID === userToId) {
                userTo.ExpoToken = p.ExpoToken;
            }
            if (p.IsAdmin) {
                adminUser.UserName = p.UserName;
            }
        });

        SendPushRemovedByAdmin(adminUser, userTo, group.GroupName);

    }

    const removeUserfromGroup = (userId2Remove, userName2Remove) => {
        swal({
            title: `? ${userName2Remove} למחוק את`,
            buttons: ['התחרטתי', 'למחוק'],
            dangerMode: true,
        })
            .then((userResponse) => {
                if (userResponse) {
                    fetch(api4removeUserInGroup(userId2Remove, group.GroupID), {
                        method: 'PUT',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        }),
                    }).then(res => { return res.json(); })
                        .then(
                            (result) => {
                                console.log(result);
                                let updatedParticipiants = group.Participiants
                                    .filter((p) => p.UserID !== userId2Remove);
                                SetGroup({ ...group, Participiants: updatedParticipiants });
                                localStorage.setItem("groupDetails", JSON.stringify({ ...group, Participiants: updatedParticipiants }));
                                HandleNotification4RemovedByAdmin(userId2Remove);
                                swal('המשתמש נמחק');
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });



    }


    const HandleNotification4exitFromGroup = () => {

        let loggedInUser = {
            UserID: loggedInUserId,
            UserName: ""
        }

        let adminUser = {
            UserID: adminUserId,
            ExpoToken: ""
        }
        group.Participiants.forEach(p => {
            if (p.UserID === loggedInUserId) {
                loggedInUser.UserName = p.UserName;
            }
            if (p.IsAdmin) {
                adminUser.ExpoToken = p.ExpoToken;
            }
        });

        SendPushIDeletedMySelf(loggedInUser, adminUser, group.GroupName);

    }

    const ExitFromThisGroup = () => {
        swal({
            title: `?בטוח שאתה רוצה לצאת מהקבוצה`,
            buttons: ['התחרטתי', 'צא'],
            dangerMode: true,
        })
            .then((userResponse) => {
                if (userResponse) {
                    fetch(api4removeUserInGroup(loggedInUserId, group.GroupID), {
                        method: 'PUT',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        }),
                    }).then(res => { return res.json(); })
                        .then(
                            (result) => {
                                console.log(result);
                                swal('יצאת הקבוצה')
                                    .then(() => {
                                        HandleNotification4exitFromGroup();
                                        history.push(`/HomePage/${loggedInUserId}`);
                                    });
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });
    }

    const DeleteGroup = () => {
        swal({
            title: `?בטוח שאתה רוצה למחוק את הקבוצה`,
            buttons: ['התחרטתי', 'מחק'],
            dangerMode: true,
        })
            .then((userResponse) => {
                if (userResponse) {
                    fetch(api4DeleteGroup, {
                        method: 'DELETE',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        }),
                    }).then(res => { return res.json(); })
                        .then(
                            (result) => {
                                console.log(result);
                                swal('הקבוצה נמחקה')
                                    .then(() => {
                                        history.push(`/HomePage/${loggedInUserId}`);
                                    });
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });

    }

    const AddParticipants2Group = async (participants) => {
        let pArr = [];
        for (let i = 0; i < participants.length; i++) {
            let newParticipant = await AuthenticateContact(participants[i].PhoneNumber);
            pArr.push(newParticipant);
        }

        let GroupObject = {
            GroupID: group.GroupID,
            Participiants: pArr
        };

        await fetch(api4AddUsers2UserInGroup, {
            method: 'PUT',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(GroupObject)
        }).then(res => { return res.json(); })
            .then(
                (result) => {
                    console.log(result)
                    let newParticipiants = group.Participiants;
                    for (let i = 0; i < pArr.length; i++) {
                        newParticipiants.push(pArr[i]);
                    }
                    SetGroup(
                        {
                            ...group,
                            Participiants: newParticipiants
                        }
                    );
                },
                (error) => {
                    console.log(error)
                })
    }

    const handleCloseListContact = (participants) => {
        SetEnableContacts(false);
        AddParticipants2Group(participants);
    }

    const handleClose = () => { setOpen(false); history.push('/AGroups') }
    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        הגדרות
                    </Typography>
                </Toolbar>
            </AppBar>


            <div className={classes.root}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" className={classes.title}>
                        <TextField
                            id="outlined-basic"
                            variant="standard"
                            onInput={editGroupName}
                            placeholder={group.GroupName}
                            onBlur={ConfirmationEditGroupName}
                            inputRef={textInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EditOutlinedIcon />
                                    </InputAdornment>
                                ),
                                className: classes.myTxtFeild
                                //↑ this ↑ has to be inside InputProps !
                            }}
                        />
                    </Typography>
                </Grid>
            </div>


            <div className={classes.ParticipiantsDiv}>
                <List dense={true}>
                    {
                        group.Participiants.map((p) => {
                            return <ListItem key={p.UserID}>
                                {!p.IsAdmin && loggedInUserId === adminUserId ?
                                    <IconButton aria-label="delete" onClick={() => { removeUserfromGroup(p.UserID, p.UserName) }}>
                                        <DeleteIcon />
                                    </IconButton>
                                    : ""
                                }
                                <ListItemText
                                    primary={p.UserName}
                                    secondary={p.IsAdmin ?
                                        <span className={classes.secondaryTxt}>מנהל</span>
                                        : ''}
                                    className={classes.listItemText}
                                />
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                            </ListItem>
                        })
                    }
                </List>
            </div>
            {
                enableContacts &&
                <div className={classes.myContactsList}>
                    <Contacts
                        userID={loggedInUserId}
                        groupName={group.GroupName}
                        close={handleCloseListContact}

                    />
                </div>
            }



            <div className={classes.footer}>
                <Fab
                    className={classes.PlusBtn}
                    color="primary"
                    aria-label="add">
                    <AddIcon onClick={() => { SetEnableContacts(true) }} />
                </Fab>
                {
                    loggedInUserId === adminUserId ?
                        <Button
                            style={{ backgroundColor: 'red' }}
                            variant="contained"
                            className={classes.myButton}
                            startIcon={<DeleteIcon />}
                            onClick={() => { DeleteGroup(); }}
                        >
                            מחק את הקבוצה
                </Button>
                        :
                        <Button
                            style={{ backgroundColor: 'red' }}
                            variant="contained"
                            className={classes.myButton}
                            startIcon={<DeleteIcon />}
                            onClick={() => { ExitFromThisGroup() }}
                        >
                            צא מהקבוצה
            </Button>
                }
            </div>



        </Dialog>

    );
}

export default withRouter(GroupSetting);
