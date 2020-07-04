import React, { useState, forwardRef, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

//Components
import GoogleMaps from '../../Components/GoogleMaps'



const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
      backgroundColor: 'darkgray',
      textAlign: 'center'
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    }
  }));
  
  const Transition = forwardRef((props, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  

export default function SearchStores(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true);



    const handleClose = () =>{
        setOpen(false);
        props.CloseDialog()
    }

    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              חיפוש סופרים
            </Typography>
          </Toolbar>
        </AppBar>
        <GoogleMaps/>
        </Dialog>
    )
}
