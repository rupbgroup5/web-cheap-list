import React, { useState, useContext, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';



import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

//ContextApi
import { ListObjContext } from "../Contexts/ListDetailsContext";
import { IsLocalContext } from "../Contexts/IsLocalContext";
import { UserIDContext } from '../Contexts/UserIDContext'

const style = {
    containerStyle: {
        width: '100%',
        height: '50vh'
    },
    btn: {
        fontFamily: '"Assistant", sans-serif',
        fontSize: 14,
        lineHeight: 1.5,
        cursor: 'pointer',
        display: 'flex',
        width: '100%',
        justifyContent: 'spaceBetween',
        color: 'inherit',
        padding: 0,
        border: 0,
        outline: 0,
        background: 'none'
    }
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '60ch',
        backgroundColor: theme.palette.background.paper,
        overflow: 'auto',
        position: 'relative'
    },
    inline: {
        display: 'inline',
    },
    gridList: {
        width: '100%',
    },
}));

const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
};


function GoogleMaps(props) {
    const classes = useStyles();

    //ContextApi 
    const { userID, SetUserID } = useContext(UserIDContext);
    const { isLocal } = useContext(IsLocalContext);
    const { listObj } = useContext(ListObjContext);

    const [selectedStore, SetSelectedStore] = useState(null)
    const [isOpen, SetIsOpen] = useState(false)
    const [clickStore, SetClickStore] = useState();
    const [animation, SetAnimation] = useState(null);
    const [isClicked, SetIsClicked] = useState(false)
    const [coords, SetCoords] = useState({})
    const [stores,SetStores] = useState(props.Stores)

    const center = {
        lat: JSON.parse(listObj.Latitude),
        lng: JSON.parse(listObj.Longitude)
    };
    let api = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/"
    if (isLocal) {
        api = "http://localhost:56794/api/"

    }





    useEffect(() => {
        if (!userID) {
            SetUserID(JSON.parse(localStorage.getItem('UserID')))
        }
        if (userID) {
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
                    console.log(error)
                }
            }
            )();
        }

    }, [api, userID]);



    const HandleInfoOpen = (s) => {
        SetSelectedStore(s);
        SetIsOpen(true);
        SetAnimation(null);
        CalculateDistance(s)

    }

    const HandleInfoClose = () => {
        SetIsOpen(false)

    }

    const HandleClickStore = (s) => {
        SetClickStore(s)
        SetIsClicked(true)
        SetAnimation(1)

    }

    const CalculateDistance = (destinion,index) => {
        const lat2 = JSON.parse(destinion.Deatils.store_gps_lat)
        const lon2 = JSON.parse(destinion.Deatils.store_gps_lng)
        const R = 6371e3; // metres
        const φ1 = coords.lat * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - coords.lat) * Math.PI / 180;
        const Δλ = (lon2 - coords.lng) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // in metres
        const km = Number(d / 1000).toFixed(2);
        stores[index] = {
            ...stores[index],
            distance: km
        }
        return km;

    }



    const PrintOutOfStock = (s) => {

        let str = `** מוצרים שאינם במלאי:  ${s.OutOfStock[0]}`
        for (let i = 1; i < s.OutOfStock.length; i++) {
            str += `, ${s.OutOfStock[i]}`
        }
        return str
    }

    const SortByDistance =  () => {
        stores.sort((a, b) => a.distance > b.distance ? 1 : -1)
       SetStores([...stores]) 
    }
    const SortByPrice = () => {
       stores.sort((a, b) => a.TotalPrice > b.TotalPrice ? 1 : -1)
       SetStores([...stores])
    }


    return (
        <span>
            {userID && <div>
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY} id="a">
                    <GoogleMap
                        mapContainerStyle={style.containerStyle}
                        center={center}
                        zoom={10}
                        options={defaultMapOptions}>

                        {props.Stores.map((s, index) =>


                            <Marker key={index} position={{ lat: JSON.parse(s.Deatils.store_gps_lat), lng: JSON.parse(s.Deatils.store_gps_lng) }}
                                animation={2}
                                onClick={() => { HandleInfoOpen(s) }}
                            />

                        )}

                        {isOpen &&
                            <Marker position={{ lat: JSON.parse(selectedStore.Deatils.store_gps_lat), lng: JSON.parse(selectedStore.Deatils.store_gps_lng) }}  >
                                <InfoWindow onCloseClick={HandleInfoClose} >
                                    <div dir='rtl' style={{ marginLeft: 20 }}>
                                        <div><b>{selectedStore.Deatils.sub_chain_name}</b></div>
                                        <div> רח' {selectedStore.Deatils.store_address}  </div>
                                        <div>{selectedStore.Deatils.city_name}, {selectedStore.Deatils.store_zip_code}</div>
                                    </div>
                                </InfoWindow>
                            </Marker>}

                        {isClicked &&
                            <Marker position={{ lat: JSON.parse(clickStore.Deatils.store_gps_lat), lng: JSON.parse(clickStore.Deatils.store_gps_lng) }}
                                animation={animation}
                                onClick={() => { HandleInfoOpen(clickStore) }}
                            />

                        }


                    </GoogleMap>
                </LoadScript>
                
              <div dir='rtl' >
                    <Button onClick={SortByDistance}>מיין לפי מרחק</Button>
            &nbsp; &nbsp;
            <Button onClick={SortByPrice}>מיין לפי מחיר</Button>
                </div>
                
                <GridList cellHeight={300} className={classes.gridList} cols={0.00001} dir='rtl' spacing={10} >
                    <List className={classes.root} dir='rtl' >
                        {stores.map((s, index) =>
                            <div key={index} >
                                <ListItem alignItems="flex-start" style={{ textAlign: 'right' }}>
                                    <ListItemText dir='rtl'
                                        primary={s.Deatils.sub_chain_name + ', ' + s.Deatils.city_name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    className={classes.inline}
                                                    color="textPrimary"
                                                >
                                                    המחיר הינו: ₪{s.TotalPrice} <br /> במרחק של   {CalculateDistance(s,index)} ק"מ
                                            {s.OutOfStock.length !== 0 ? <span style={{ fontSize: 'x-small' }}><br />{PrintOutOfStock(s)}</span> : ''}
                                                </Typography>
                                                <br />
                                                <Button color='primary' onClick={() => HandleClickStore(s)}>הראה לי על המפה</Button>
                                            </React.Fragment>
                                        }
                                    />
                                   
                                </ListItem>
                                <Divider variant="inset" component="li" />
                            </div>
                            


                        )}
                         {props.Stores.length === 0 && <div dir='rtl'>לא נמצאו סופרים בסביבתך</div>}
                    </List>
                </GridList>

                                    {console.log(props.Stores)}
            </div>}
          
        </span>
    )
}

export default React.memo(GoogleMaps)