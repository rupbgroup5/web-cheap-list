import React, { useState, useContext } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps"



//ContextApi
import { ListObjContext } from "../Contexts/ListDetailsContext";


const Map = (props) => {

    //ContextApi
    const { listObj } = useContext(ListObjContext);
    const [selectedStore, SetSelectedStore] = useState(null)
    const [isOpen, SetIsOpen] = useState(false)



    const defaultMapOptions = {
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
    };

    const HandleInfoOpen = (s) => {
        console.log(s)
        SetSelectedStore(s);
        SetIsOpen(true);

    }

    const HandleInfoClose = () => { SetIsOpen(false); }


    return (

        
        <GoogleMap
            defaultZoom={12}
            defaultCenter={{ lat: JSON.parse(listObj.Latitude), lng: JSON.parse(listObj.Longitude) }}
            defaultOptions={defaultMapOptions}
        >
            {props.Stores.map((s, index) =>

                <Marker key={index} position={{ lat: JSON.parse(s.Deatils.store_gps_lat), lng: JSON.parse(s.Deatils.store_gps_lng) }}
                    animation={2}
                    onClick={() => { HandleInfoOpen(s) }}
                />
               
                
            )}
             {props.click !== undefined &&
                    <Marker position={{lat:JSON.parse(props.click.Deatils.store_gps_lat), lng: JSON.parse(props.click.Deatils.store_gps_lng)}}
                    animation={1}
                    />
                    }
            {isOpen &&
                <Marker dir='rtl' style={{ backgroundColor: 'black' }} position={{ lat: JSON.parse(selectedStore.Deatils.store_gps_lat), lng: JSON.parse(selectedStore.Deatils.store_gps_lng) }}>
                    <InfoWindow dir='rtl' onCloseClick={HandleInfoClose} >
                        <div>
                            <div><b>{selectedStore.Deatils.sub_chain_name}</b></div>
                            <div> רח' {selectedStore.Deatils.store_address}  </div>
                            <div>{selectedStore.Deatils.city_name}, {selectedStore.Deatils.store_zip_code}</div>
                        </div>
                    </InfoWindow>
                </Marker>}
             


        </GoogleMap>







    )
}





function GoogleMaps(props) {
    const WrappedMap = withScriptjs(withGoogleMap(Map))
    

    return (
        <div dir='rtl' style={{ width: '100vw', height: '50vh', }}>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=HE&region:israel`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                Stores={props.Stores}
                click = {props.click}
            />
        </div>
    )
}

export default GoogleMaps;
