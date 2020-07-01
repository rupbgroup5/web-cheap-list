import React, { useState, forwardRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Slider from '@material-ui/core/Slider';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  direction: 'rtl', 
});

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  FormControl: {
    alignItems: 'center',
    margin: theme.spacing(1),
    minWidth: 170,
  },
  TextField: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'

  }
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  //const [label, SetLabel] = useState('הזן טווח בק"מ לחיפוש')
  const [type, SetType] = useState('number')
  const [select, SetSelect] = useState(false)
  const [enable, SetEnable] = useState(false)
  const [openSelect, setOpenSelect] = useState(false);
  const [cities, SetCities] = useState([])

  let api = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/GetCities/"
  if (true) {
      api = "http://localhost:56794/api/GetCities/"
    }

  useEffect(() => {
    (async () => {
      try {
          const res = await fetch(api, {
              method: 'GET',
              headers: new Headers({
                  'Content-Type': 'application/json; charset=UTF-8',
              }),
          })
          let result = await res.json();
          SetCities(result)
      } catch (error) {
          console.log(error)
      }
  }
  )();
  }, []);






  const handleChange = (event) => {
    console.log('traget', event.target.value)
    if (event.target.value === 'city') {
      //SetLabel('הזן עיר לחיפוש')
      SetEnable(true)
      SetSelect(true)
      SetType('text')
    }
    if (event.target.value === 'currentLocation') {
      //SetLabel('הזן טווח בק"מ לחיפוש')
      SetEnable(false);
      SetType('number')
    }

  }


  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  };
  const handleOk = () => {
    setOpen(false);
    props.CloseDialog()
  }

  const handleCloseSelect = () => {
    setOpenSelect(false)
  }


  const handleOpenSelect = () => {
    setOpenSelect(true)
  }
  function valuetext(value) {
    return {value};
  }

  const marks = [
    {
      value: 5,
      label: '5',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 15,
      label: '15',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 25,
      label: '25'
    },
    {
      value: 30,
      label: '30'
    }
  ];





  return (
    <div dir='rtl' style={{ alignItems: 'center' }} >
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              הגדרות חיפוש
            </Typography>
            <Button autoFocus color="inherit" onClick={handleOk}>
              אישור
            </Button>
          </Toolbar>
        </AppBar>
        <br /><br />
        <FormControl className={classes.FormControl}>
          <RadioGroup row aria-label="position" name="position" defaultValue='currentLocation' onChange={handleChange} >


            <FormControlLabel
              value="city"
              control={<Radio color="default" />}
              label="עיר"
              labelPlacement="start"
            />

            <FormControlLabel
              value="currentLocation"
              control={<Radio color="default" />}
              label="מיקום נוכחי"
              labelPlacement="start"
            />
            <br />

          </RadioGroup>
        </FormControl>

        <div dir='rtl' className={classes.TextField}>
          {!enable && <span>
            <Typography id="discrete-slider" gutterBottom>
              בחר טווח ק"מ רצוי לחיפוש
           </Typography>
            <Slider
              defaultValue={5}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={5}
              marks={marks}
              min={5}
              max={30}
            /></span>}

          {enable && <Autocomplete 
            id="combo-box-demo"
            options={cities}
            getOptionLabel={(option) => option.cityName}
            style={{ width: 170}}
            noOptionsText='אין תוצאות'
            closeIcon={false}           
            blurOnSelect={true}
            onChange={console.log((option) => option.cityID)}
            renderInput={(params) => <TextField {...params} className="standard-basic" label="הזן עיר לחיפוש" variant="standard" required={true} />}
          />}
        </div>
      </Dialog>
    </div>
  );

}
