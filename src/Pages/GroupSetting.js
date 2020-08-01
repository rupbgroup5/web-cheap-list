//React
import React, { forwardRef, useState, useRef, useContext, useEffect } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

//our components
import Contacts from '../Components/Contacts'
import AuthenticateContact from '../Components/AuthenticateContact'

//context API
import { IsLocalContext } from '../Contexts/IsLocalContext'
import { GroupDetailsContext } from "../Contexts/GroupDetailsContext"
import { UserIDContext } from "../Contexts/UserIDContext"

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
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';

//sweetalert
import swal from 'sweetalert'

//notificaion handle
import {
    SendPushIDeletedMySelf,
    SendPushRemovedByAdmin,
    AsyncSendPush_GroupDeletedByAdmin,
    SendPushAddToGroup
} from '../Components/SendPush'




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
        bottom: '15vh',
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
    const history = useHistory();
    const classes = useStyles();
    const textInput = useRef(null);
    const [open, setOpen] = useState(true);
    let tempName = "";
    const [enableContacts, SetEnableContacts] = useState(false);

    //Context API:
    const { isLocal } = useContext(IsLocalContext);
    const { groupDetails, SetGroupDetails } = useContext(GroupDetailsContext);
    const { userID, SetUserID } = useContext(UserIDContext);

    useEffect(() => {
        (() => {
            if (!groupDetails) {
                SetGroupDetails(JSON.parse(localStorage.getItem('groupDetails')));
            }
            if (!userID) {
                SetUserID(JSON.parse(localStorage.getItem('UserID')));
            }
        })();
    }, []);

    // const loggedInUserId = userID;


    let adminUser = {
        UserID: 0,
        UserName: ""
    }
    if (groupDetails) {


        groupDetails.Participiants.map((p) => {
            if (p.IsAdmin) {
                adminUser.UserID = p.UserID;
                adminUser.UserName = p.UserName;
                adminUser.ExpoToken = p.ExpoToken;
                return;
            }
        });
    }


    let api4EditGroupName;
    let api4DeleteGroup;
    let api4AddUsers2UserInGroup;
    let api4removeUserInGroup;
    if (isLocal) {
        if (groupDetails) {
            const localPrefix = "http://localhost:56794/api/appGroups";
            api4EditGroupName = `${localPrefix}`;
            api4DeleteGroup = `${localPrefix}/${groupDetails.GroupID}`;
            api4AddUsers2UserInGroup = `${localPrefix}/AddUsers2UserInGroup`;
            api4removeUserInGroup = (userId, GroupId) => {
                return `${localPrefix}/RemoveUserFromGroup/${userId}/${GroupId}`;
            }
        }
    } else { //global
        if (groupDetails) {
            const globalPrefix = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppGroups";
            api4EditGroupName = `${globalPrefix}`;
            api4DeleteGroup = `${globalPrefix}/${groupDetails.GroupID}`;
            api4AddUsers2UserInGroup = `${globalPrefix}/AddUsers2UserInGroup`;
            api4removeUserInGroup = (userId, GroupId) => {
                return `${globalPrefix}/RemoveUserFromGroup/${userId}/${GroupId}`;
            }
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
                            GroupID: groupDetails.GroupID,
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
                                    SetGroupDetails({ ...groupDetails, GroupName: tempName });
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
        };


        let group2send = {
            GroupID: groupDetails.GroupID,
            GroupName: groupDetails.GroupName
        };
        let notValidExpo = false;
        groupDetails.Participiants.forEach(p => {
            notValidExpo = p.ExpoToken === null || p.ExpoToken === "";
            if (p.UserID === userToId && !notValidExpo) {
                userTo.ExpoToken = p.ExpoToken;
                SendPushRemovedByAdmin(adminUser, userTo, group2send);
            }
        });



    }

    const removeUserfromGroup = (userId2Remove, userName2Remove) => {
        swal({
            title: `? ${userName2Remove} למחוק את`,
            buttons: ['התחרטתי', 'למחוק'],
            dangerMode: true,
        })
            .then((userResponse) => {
                if (userResponse) {
                    fetch(api4removeUserInGroup(userId2Remove, groupDetails.GroupID), {
                        method: 'PUT',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        }),
                    }).then(res => { return res.json(); })
                        .then(
                            (result) => {
                                console.log(result);
                                let updatedParticipiants = groupDetails.Participiants
                                    .filter((p) => p.UserID !== userId2Remove);
                                SetGroupDetails({ ...groupDetails, Participiants: updatedParticipiants });
                                localStorage.setItem("groupDetails", JSON.stringify({ ...groupDetails, Participiants: updatedParticipiants }));
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
            UserID: userID,
            UserName: ""
        }


        let group2send = {
            GroupID: groupDetails.GroupID,
            GroupName: groupDetails.GroupName
        };
        groupDetails.Participiants.forEach(p => {
            if (p.UserID === userID) {
                loggedInUser.UserName = p.UserName;
            }
        });

        SendPushIDeletedMySelf(loggedInUser, adminUser, group2send);

    }

    const ExitFromThisGroup = () => {
        swal({
            title: `?בטוח שאתה רוצה לצאת מהקבוצה`,
            buttons: ['התחרטתי', 'צא'],
            dangerMode: true,
        })
            .then((userResponse) => {
                if (userResponse) {
                    fetch(api4removeUserInGroup(userID, groupDetails.GroupID), {
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
                                        history.push(`/HomePage/${userID}`);
                                    });
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });
    }



    const HandleNotification4DeleteGroup = async () => {


        let idsOfUsersTo = [];
        let exposOfUsers2 = [];
        let notValidExpo = false;
        groupDetails.Participiants.forEach(p => {
            if (!p.IsAdmin) {// no need to send push to the admin...
                idsOfUsersTo.push(p.UserID);
            }
            notValidExpo = p.ExpoToken === null || p.ExpoToken === "";
            if (!notValidExpo) {
                exposOfUsers2.push(p.ExpoToken);
            }

        });
        await AsyncSendPush_GroupDeletedByAdmin(adminUser, exposOfUsers2, idsOfUsersTo, groupDetails.GroupName);

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
                                HandleNotification4DeleteGroup();
                                swal('הקבוצה נמחקה')
                                    .then(() => {
                                        history.push(`/HomePage/${userID}`);
                                    });
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });

    }

    const AddParticipants2Group = async (participants) => {
        let justAddedParticipants = [];
        for (let i = 0; i < participants.length; i++) {
            let newParticipant = await AuthenticateContact(participants[i].PhoneNumber);
            justAddedParticipants.push(newParticipant);
        }

        let GroupObject = {
            GroupID: groupDetails.GroupID,
            Participiants: justAddedParticipants
        };

        await fetch(api4AddUsers2UserInGroup, {//post justAddedParticipants 2 DB
            method: 'PUT',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(GroupObject)
        }).then(res => { return res.json(); })
            .then(
                (/**result*/) => {
                    // console.log("result: →", result)
                    let newParticipiants = groupDetails.Participiants;
                    for (let i = 0; i < justAddedParticipants.length; i++) {
                        newParticipiants.push(justAddedParticipants[i]);
                    }
                    SetGroupDetails(
                        {
                            ...groupDetails,
                            Participiants: newParticipiants
                        }
                    );
                    localStorage.setItem("groupDetails",
                        JSON.stringify(
                            {
                                ...groupDetails, Participiants: newParticipiants
                            }
                        )
                    );

                    let notValidExpo = false;
                    justAddedParticipants.forEach((np) => {
                        notValidExpo = np.ExpoToken === null || np.ExpoToken === "";
                        if (!notValidExpo) {
                            SendPushAddToGroup(np.ExpoToken, adminUser.UserName, groupDetails.GroupName);
                        }
                    });

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
        groupDetails ?
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
                                placeholder={groupDetails.GroupName}
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
                            <PersonAddOutlinedIcon onClick={() => { SetEnableContacts(true) }} />
                        </Typography>

                    </Grid>

                </div>


                <div className={classes.ParticipiantsDiv}>
                    <List dense={true}>
                        {
                            groupDetails.Participiants.map((p) => {
                                return <ListItem key={p.UserID}>
                                    {!p.IsAdmin && userID === adminUser.UserID ?
                                        //show the DeleteIcon only if logged in user is admin and side with one he is not admin himself 
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
                            userID={userID}
                            groupName={groupDetails.GroupName}
                            close={handleCloseListContact}

                        />
                    </div>
                }



                <div className={classes.footer}>
                    {
                        userID === adminUser.UserID ?
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

            :
            <span></span>
    );
}

export default withRouter(GroupSetting);
