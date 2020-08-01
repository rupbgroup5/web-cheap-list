import React, { useState, useEffect, useContext } from 'react';
import { withRouter, useHistory,useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, Button } from '@material-ui/core';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MailIcon from '@material-ui/icons/Mail';


import swal from 'sweetalert'

//ContextApi
import { UserIDContext } from '../Contexts/UserIDContext'
import { IsLocalContext } from '../Contexts/IsLocalContext'
import { PageTitleContext } from "../Contexts/PageTitleContext";


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: "inline-block",

    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexShrink: 0,
        fontFamily: "'Heebo', sans-serif",
        color: 'black'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        paddingRight: '25%'
    },
    TextField: {
        textAlign: 'center',
    },
    label: {
        fontSize: '14px',
        fontFamily: "'Heebo', sans-serif",
        marginLeft: '5px'

    }
}));

function UserProfile() {

   
    const classes = useStyles();
    const history = useHistory();
    //ContextApi
    const { userID, SetUserID } = useContext(UserIDContext)
    const { isLocal } = useContext(IsLocalContext);
    const { SetPageTitle } = useContext(PageTitleContext);

    const [user, SetUser] = useState()
    const [expanded, setExpanded] = useState(false);
    const [showPassword, SetShowPassword] = useState(false)
    const [isVerified, SetVerified] = useState(0)
    const [tempUser, SetTempUser] = useState({
        UserName: '',
        UserMail: '',
        UserPassWord: '',
        UserPassWordVali: ''
    })
    let { userIDfromRN  } = useParams();
    if (userIDfromRN === undefined) {
        userIDfromRN = userID
    }


    let apiAppUser = `http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppUsers/`
    if (isLocal) {
        apiAppUser = `http://localhost:56794/api/AppUsers/`
    }

    useEffect(() => {
        try {
            (async function fetchMyAPI() {
                const res = await fetch(apiAppUser + `GetUser/${userIDfromRN}`, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                    }),
                })
                let data = await res.json();
                SetUser(data)
                SetUserID(userIDfromRN)
                SetPageTitle('עריכת פרופיל')
            }());
        } catch (error) {
            console.log(error)
        }
    }, [userIDfromRN]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleClickShowPassword = () => {
        SetShowPassword(!showPassword);
    };

    const handleChangeUserName = (e) => {
        SetTempUser({ ...tempUser, userName: e.target.value })
    }

    const handleChangeUserMail = (e) => {
        SetTempUser({ ...tempUser, UserMail: e.target.value })
    }
    const handleChangePassword = (e) => {
        SetTempUser({ ...tempUser, UserPassword: e.target.value })
    }

    const handleChangePasswordValid = (e) => {
            SetTempUser({ ...tempUser, UserPasswordVali: e.target.value }) 
        if (tempUser.UserPassword === e.target.value) {
            SetVerified('')
        } else SetVerified('2px solid red')
    }

    const SaveChanges = async () => {
        let u ={}
        if (tempUser.userName !== '') {
            u ={
                UserName:tempUser.userName
            }
        }
        if (tempUser.UserMail !== '') {
            u ={
                ...u,
                UserMail:tempUser.UserMail
            }
        }
        if (tempUser.UserPassword !== '') {
            if (tempUser.UserPassword !== tempUser.UserPasswordVali) {
                console.log('tempUser.UserPassword',tempUser.UserPassword)
                console.log('tempUser.UserPasswordVali',tempUser.UserPasswordVali);
                return swal('הסיסמאות אינן תואמות')
            }
            u={
                ...u,
                UserPassWord: tempUser.UserPassword,
                UserID: user.UserID,
            }
        }

        try {
            const res = await fetch(apiAppUser + userID, {
              method: 'PUT',
              headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
              }),
              body: JSON.stringify(u)
            })
            let result = await res.json();
            console.log(result)
            if (userID === undefined) {
                let id = JSON.parse(localStorage.getItem('UserID'))
                console.log(id)
                SetUserID(id)
                history.push(`/HomePage/${id}`);
            } else history.push(`/HomePage/${userID}`);
          } catch (error) {
            console.log(error)
          }

        console.log(tempUser)


    }






    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const ReturnToHomePage = () => {
        if (userID === undefined) {
            let id = JSON.parse(localStorage.getItem('UserID'))
            console.log(id)
            SetUserID(id)
            history.push(`/HomePage/${id}`);
        } else history.push(`/HomePage/${userID}`);
    }







    return (
        <span>
            {user && <div className={classes.root} id='userProfile'>
                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                    >
                        <Typography className={classes.heading}>
                            <b> שם משתמש</b>
                        </Typography>
                        <Typography className={classes.secondaryHeading}>{user.UserName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* <Typography> */}
                            <label className={classes.label}>שם משתמש חדש</label>
                            &nbsp;
                            <TextField dir='rtl'
                                onChange={handleChangeUserName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        {/* </Typography> */}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography className={classes.heading}>
                            <b>מייל</b>
                        </Typography>
                        <Typography className={classes.secondaryHeading}>
                            {user.UserMail}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* <Typography> */}
                            <label className={classes.label}>הקלד מייל חדש</label>
                            &nbsp;
                            <TextField dir='rtl'
                                onChange={handleChangeUserMail}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        {/* </Typography> */}
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                    >
                        <Typography className={classes.heading}>
                            <b> החלפת סיסמה</b>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* <Typography> */}
                      <div dir='rtl'>
                      <label className={classes.label}>הקלד סיסמה</label>
                            &nbsp;
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChangePassword}
                                endAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <br /> <br />
                            <label className={classes.label}>אימות סיסמה</label>
                                &nbsp;
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                onChange={handleChangePasswordValid}
                                style={{ border: isVerified }}
                                endAdornment={
                                    <InputAdornment position="start">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                } />
                      </div>
                        {/* </Typography> */}
                    </AccordionDetails>
                </Accordion>
                <br />
                <div>
                    <Button style={{ float: 'right', color: '#3f69b5' }} onClick={SaveChanges}>החל שינויים</Button>
                    <Button onClick={ReturnToHomePage} style={{ float: 'left', color: '#d63030' }} >עבור לדף הבית ללא שינויים</Button>
                </div>
            </div>}
        </span>
    );
}
export default withRouter(UserProfile)