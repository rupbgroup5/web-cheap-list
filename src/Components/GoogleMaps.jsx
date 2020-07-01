import React, { useState, useEffect } from 'react';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps"

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

const Map = () => {
    // if (navigator.geolocation) {
    //     navigator.geolocation.watchPosition(function(position) {
    //       console.log("Latitude is :", position.coords.latitude);
    //       console.log("Longitude is :", position.coords.longitude);
    //     });
    //   }




    return (
        <GoogleMap
            defaultZoom={10}
            defaultCenter={{ lat: 32.3480081, lng: 34.9158805 }}>

        </GoogleMap>
    )
}



function GoogleMaps(props) {
    const WrappedMap = withScriptjs(withGoogleMap(Map))

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <WrappedMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBY0p3dpeidzH5cIVSgcleRS4CrVLRGweM`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    )
}

export default GoogleMaps;
