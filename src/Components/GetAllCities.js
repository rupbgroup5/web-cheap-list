import {useEffect} from 'react'

export default function GetAllCities() {

    //run once


    useEffect(() => {
        (async function fetchMyAPI() {
            try {
              const res = await fetch("https://cors-anywhere.herokuapp.com/https://api.superget.co.il?api_key=847da8607b5187d8ad1ea24fde8ee8016b19a6db&action=GetCities", {
                method: 'GET',
                headers: new Headers({
                  'Content-Type': 'application/json; charset=UTF-8',
                }),
              })
              let data = await res.json();
              console.log(data);
              let arrCities = []

             await data.forEach(d => {
                  let city ={
                      cityID: d.city_id,
                      cityName: d.city_name,
                      Lat: d.city_gps_lat,
                      Lng: d.city_gps_lng

                  }
                  arrCities.push(city)
              });

              console.log(arrCities);
            
              const resDB = await fetch("http://localhost:56794/api/Cities", {
                method: 'POST',
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8'
                }),
                body: JSON.stringify(arrCities)
            })
            const resultDB = await resDB.json()
            } catch (error) {
              console.log(error)
            }
          })();


    }, [])

    return null
        
    
}
