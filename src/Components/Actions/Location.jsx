import React, { useState, forwardRef, useEffect, useContext } from 'react';
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
import Slider from '@material-ui/core/Slider';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';

//Context API:
import { ListObjContext } from "../../Contexts/ListDetailsContext";
import { IsLocalContext } from "../../Contexts/IsLocalContext";
import { UserIDContext } from '../../Contexts/UserIDContext'









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

export default function Location(props) {
  const classes = useStyles();

  //ContextApi
  const { listObj, SetListObj } = useContext(ListObjContext);
  const { isLocal } = useContext(IsLocalContext);
  const { userID } = useContext(UserIDContext);

  
  const [open, setOpen] = useState(true);
  const [enable, SetEnable] = useState((listObj.TypeLocation === 'currentLocation' ? false : true))
  const [cities, SetCities] = useState([])
  const [coords, SetCoords] = useState({})

  let api = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/"
  if (isLocal) {
    api = "http://localhost:56794/api/"

  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(api + 'Cities', {
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
  }, [api]);

  useEffect(() => {
    (async () => {
      try {
        const resUser = await fetch(`${api}AppUsers/GetUser/${userID}`, {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
          }),
        })
        let resGetUser = await resUser.json();
        SetCoords({
          lat: resGetUser.Latitude,
          lng: resGetUser.Longitude
        })
      } catch (error) {

      }
    }
    )();
  }, [api,userID]);



  const handleChange = (event) => {

    if (event.target.value === 'city') {
      SetEnable(true)
      SetListObj({
        ...listObj,
        TypeLocation: 'city',
        KM_radius: 5
      })
    }
    if (event.target.value === 'currentLocation') {
      SetEnable(false);
      SetListObj({
        ...listObj,
        TypeLocation: 'currentLocation',
        CityName: 'הזן עיר לחיפוש',
        CityID: 0,
        Latitude:coords.lat,
        Longitude:coords.lng
      })

    }

  }

  const handleKM = (event, newValue) => {
    SetListObj({
      ...listObj,
      KM_radius: newValue,
    })
  }

  const handleCity = (event, newValue) => {
    console.log(newValue.Lat, newValue.Lng )
    SetListObj({
      ...listObj,
      TypeLocation: 'city',
      CityID: newValue.cityID,
      CityName: newValue.cityName,
      Latitude: newValue.Lat,
      Longitude: newValue.Lng,
    })
  }


  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  };

  const handleOk = async () => {

    let l = {};
    let OK = true;

    if (listObj.TypeLocation === 'currentLocation') {
      l = {
        TypeLocation: listObj.TypeLocation,
        ListID: listObj.ListID,
        Latitude: coords.lat,
        Longitude: coords.lng,
        CityName: null,
        CityID: listObj.CityID,
        KM_radius: listObj.KM_radius
      }
    } else {
      if (listObj.CityName === 'הזן עיר לחיפוש') {
        alert('הזן עיר תחילה')
        OK = false
      }
      console.log('a',listObj)
      l = {
        TypeLocation: listObj.TypeLocation,
        ListID: listObj.ListID,
        Latitude: listObj.Latitude,
        Longitude: listObj.Longitude,
        CityName: listObj.CityName,
        CityID: listObj.CityID,
        KM_radius: 5
      }
    }
    if (OK) {
    try {
      const res = await fetch(`${api}appList/Location`, {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
        body: JSON.stringify(l)
      })
      let result = await res.json();
      console.log(result)
      setOpen(false);
      props.CloseDialog()
    } catch (error) {
      console.log(error)
    }

    }
  }


  function valuetext(value) { return { value }; }

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
              הגדרות מיקום
            </Typography>
            <Button autoFocus color="inherit" onClick={handleOk}>
              אישור
            </Button>
          </Toolbar>
        </AppBar>
        <br /><br />
        <FormControl className={classes.FormControl}>
          <RadioGroup row aria-label="position" name="position" value={listObj.TypeLocation} onChange={handleChange} >
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
              value={listObj.KM_radius}
              getAriaValueText={valuetext}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={5}
              marks={marks}
              min={5}
              max={30}
              onChange={handleKM}
            /></span>}

          {enable && <Autocomplete
            id="combo-box-demo"
            options={cities}
            getOptionLabel={(option) => option.cityName}
            style={{ width: 170 }}
            noOptionsText='אין תוצאות'
            closeIcon={false}
            blurOnSelect={true}
            onChange={handleCity}
            renderInput={(params) => <TextField {...params} className="standard-basic" label={listObj.CityName} variant="standard" required={true} />}
          />}
        </div>
      </Dialog>
    </div>
  );

}
