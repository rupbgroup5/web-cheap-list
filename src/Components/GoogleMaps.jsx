import React, { useState, useContext } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

//ContextApi
import { ListObjContext } from "../Contexts/ListDetailsContext";

const  style ={
    containerStyle : {
        width: '100%',
        height: '50vh'
    },
    btn: {
        fontFamily: '"Assistant", sans-serif',
        fontSize: 16,
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


const defaultMapOptions = {
    fullscreenControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
};

function GoogleMaps(props) {

    const { listObj } = useContext(ListObjContext);
    const [selectedStore, SetSelectedStore] = useState(null)
    const [isOpen, SetIsOpen] = useState(false)
    const [clickStore, SetClickStore] = useState();
    const [animation, SetAnimation] = useState(null);
    const [bool,SetBool] = useState(false)

    const center = {
        lat: JSON.parse(listObj.Latitude),
        lng: JSON.parse(listObj.Longitude)
    };


    const HandleInfoOpen = (s) => {
        SetSelectedStore(s);
        SetIsOpen(true);
        SetAnimation(null);

    }

    const HandleInfoClose = () => { 
        SetIsOpen(false)
       
    }

    const HandleClickStore = (s) => {
       SetClickStore(s)
       SetBool(true)
      SetAnimation(1)
    }

    
    return (
        <div>
            {console.log(props.Stores)}
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY}>
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
                        <Marker  position={{ lat: JSON.parse(selectedStore.Deatils.store_gps_lat), lng: JSON.parse(selectedStore.Deatils.store_gps_lng) }}  >
                            <InfoWindow  onCloseClick={HandleInfoClose} >
                                <div dir='rtl'>
                                    <div><b>{selectedStore.Deatils.sub_chain_name}</b></div>
                                    <div> רח' {selectedStore.Deatils.store_address}  </div>
                                    <div>{selectedStore.Deatils.city_name}, {selectedStore.Deatils.store_zip_code}</div>
                                </div>
                            </InfoWindow>
                        </Marker>}

                        {bool && 
                        <Marker position={{ lat: JSON.parse(clickStore.Deatils.store_gps_lat), lng: JSON.parse(clickStore.Deatils.store_gps_lng) }}
                         animation={animation}
                         onClick={() => { HandleInfoOpen(clickStore) }}
                           />
                        }


                </GoogleMap>
            </LoadScript>
            <div dir='rtl' style={{marginTop:15}}>
                {props.Stores.map((s,index)=>
                <button key={index} style={style.btn} onClick={()=> HandleClickStore(s)}>
                    המחיר לסל קניות ב- &nbsp;<b> {s.Deatils.sub_chain_name}</b> &nbsp; {`${s.Deatils.city_name}- ${s.Deatils.store_address} הינו:`} &nbsp; <b>₪{s.TotalPrice}</b> 
                </button>
                
                )}
            
        </div>
        </div>
    )
}

export default React.memo(GoogleMaps)