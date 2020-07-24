import React, { useState, useContext, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';



import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import GridList from '@material-ui/core/GridList';
import Typography from '@material-ui/core/Typography';

//ContextApi
import { ListObjContext } from "../Contexts/ListDetailsContext";
import { Button } from '@material-ui/core';

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

    const { listObj } = useContext(ListObjContext);
    const [selectedStore, SetSelectedStore] = useState(null)
    const [isOpen, SetIsOpen] = useState(false)
    const [clickStore, SetClickStore] = useState();
    const [animation, SetAnimation] = useState(null);
    const [isClicked, SetIsClicked] = useState(false)

    const center = {
        lat: JSON.parse(listObj.Latitude),
        lng: JSON.parse(listObj.Longitude)
    };

    const [scrollPosition, setSrollPosition] = useState(0);

    window.addEventListener('scroll', () => { console.log(window.pageYOffset) })

    useEffect(() => {
        window.addEventListener('scroll', () => { console.log('scrol') });


    });

    const handleScroll = () => {
        const position = window.pageYOffset;
        setSrollPosition(position);
    };

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

    const CalculateDistance = (destinion) => {
        const lat2 = JSON.parse(destinion.Deatils.store_gps_lat)
        const lon2 = JSON.parse(destinion.Deatils.store_gps_lng)
        const R = 6371e3; // metres
        const φ1 = center.lat * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - center.lat) * Math.PI / 180;
        const Δλ = (lon2 - center.lng) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // in metres
        const km = Number(d / 1000).toFixed(2);
        return km;

    }




    return (
        <div>
            {console.log(scrollPosition)}
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
                                <div dir='rtl' style={{ marginLeft:20}}>
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
            <GridList cellHeight={300} className={classes.gridList}  cols={0.00001} dir='rtl' spacing={10} >
            <List className={classes.root} dir='rtl' >
                {props.Stores.map((s, index) =>
                   <div>
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
                                            המחיר הינו: ₪{s.TotalPrice} <br/> במרחק של   {CalculateDistance(s)} ק"מ
                                        </Typography>
                                        <br/>
                                        <Button color='primary' onClick={() => HandleClickStore(s)}>הראה לי על המפה</Button>
                                    </React.Fragment>
                                }
                                />

                        </ListItem>
                        <Divider variant="inset" component="li" />
                                </div>
                   

                )}
                 </List>
            </GridList>



        </div>
    )
}

export default React.memo(GoogleMaps)