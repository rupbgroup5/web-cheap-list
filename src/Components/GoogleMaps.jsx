import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps"



//ContextApi
import { ListObjContext } from "../Contexts/ListDetailsContext";

// {selectedPark && (
//     <InfoWindow
//         position={{ lat: selectedPark.latitude, lng: selectedPark.longitude }}
//         onCloseClick={() => { selectedPark(null) }}
//     >
//         <div>מאמי אני אוהב אותך !</div>
//     </InfoWindow>
// )}

{/* 
            <Marker position={{ lat: 32.3480081, lng: 34.9158805 }}
            //onClick={()=>{SetSelectedPark(park)}}
            />
           */}

const Map = (props) => {

    //ContextApi
    const { listObj } = useContext(ListObjContext);



    const defaultMapOptions = {
        fullscreenControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
    };


    return (
        <div>
            {console.log(props.Stores[0].Deatils.store_gps_lng)}
            <GoogleMap
                defaultZoom={12}
                defaultCenter={{ lat: JSON.parse(listObj.Latitude), lng: JSON.parse(listObj.Longitude) }}
                defaultOptions={defaultMapOptions}
            >


            </GoogleMap>

            {props.Stores.map((s,index)=>
            <Marker key={index} position={{ lat: JSON.parse(s.Deatils.store_gps_lat), lng: JSON.parse(s.Deatils.store_gps_lng) }} 
            animation={2}
            />
            )}
        </div>



    )
}





function GoogleMaps(props) {
    const WrappedMap = withScriptjs(withGoogleMap(Map))

    return (
        <div style={{ width: '100vw', height: '50vh' }}>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}&language=HE&region:israel`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                Stores={props.Stores}
            />
        </div>
    )
}

export default GoogleMaps;
