//React
import React, { forwardRef, useState } from 'react'
import { withRouter, useHistory } from 'react-router-dom'

//style
import '../Styles/GroupSetting.css'

//material-ui
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

// import Button from '@material-ui/core/Button'
// import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
// import ListIcon from '@material-ui/icons/List'





const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
        backgroundColor: 'darkgray',
        textAlign: 'center'
    }
    ,
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
        fontSize: '8vh',
        fontFamily: 'Amatic SC',

    },

}));


const Transition = forwardRef((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});

const GroupSetting = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const [group, SetGroup] = useState(
        localStorage.getItem('groupDetails') ?
            JSON.parse(localStorage.getItem('groupDetails')) :
            undefined
    );


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

        </Dialog>

    );
}

export default withRouter(GroupSetting);
