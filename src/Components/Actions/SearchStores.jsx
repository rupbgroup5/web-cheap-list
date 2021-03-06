import React, { useState, forwardRef, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';




import { css } from "@emotion/core";
import RingLoader from "react-spinners/RingLoader";



//ContextApi
import { ListObjContext } from "../../Contexts/ListDetailsContext";
import { ProductsCartContext } from '../../Contexts/ProductsCartContext'

//Components
import GoogleMaps from '../../Components/GoogleMaps'



const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: 'darkgray',
    textAlign: 'center'
  },
  title: {
    flex: 1,
    fontFamily:"'Heebo', sans-serif",
    fontSize: '3.5vh',
    textAlign:'center'
  }
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});



export default function SearchStores(props) {
  const classes = useStyles();

  //ContextApi
  const { listObj } = useContext(ListObjContext);
  const { productCart } = useContext(ProductsCartContext);

  const [open, setOpen] = useState(true);
  const [stores, SetStores] = useState([]);
  const [loading, SetLoading] = useState(true)

  const queryString = require('query-string');
  let superGetAPI = `https://api.superget.co.il?api_key=${process.env.REACT_APP_SUPERGET_KEY}&`


  const override = css`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
  
 ;`;




  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
  }

  useEffect(() => {
    (async () => {
      console.log(listObj)
      try {
        //GetStores
        let query;
        if (listObj.TypeLocation === 'currentLocation') {
          data.GetStoresByGPS.latitude = JSON.parse(listObj.Latitude)
          data.GetStoresByGPS.longitude = JSON.parse(listObj.Longitude)
          data.GetStoresByGPS.km_radius = listObj.KM_radius
          query = await queryString.stringifyUrl({ url: superGetAPI, query: data.GetStoresByGPS })
        } else {
          data.GetStoresByCityID.city_id = listObj.CityID
          query = await queryString.stringifyUrl({ url: superGetAPI, query: data.GetStoresByCityID })
        }
        let resStoreID = await fetch(query, { method: 'GET' })
        let resultStoreID = await resStoreID.json()
        
        console.log(resultStoreID)

        let tempArrayStore = []
        for (let i = 0; i < resultStoreID.length; i++) {
          let p = 0;
          let outOfStock = [];
          data.GetPriceByProductBarCode.store_id = resultStoreID[i].store_id
          let barcodeArr = []
          //GetPriceByBarcode Per Store
          for (let j = 0; j < productCart.length; j++) {
            barcodeArr.push(productCart[j].product_barcode)
          }
          data.GetPriceByProductBarCode['product_barcode[]'] = barcodeArr
          query = queryString.stringifyUrl({ url: superGetAPI, query: data.GetPriceByProductBarCode })

          //https://cors-anywhere.herokuapp.com/
          if (i >= resultStoreID.length / 2) {
            query = queryString.stringifyUrl({ url: 'https://allow-any-origin.appspot.com/' + superGetAPI, query: data.GetPriceByProductBarCode })
          }
          const res = await fetch(query, { method: 'GET' })
          var result = await res.json()
          if (result.error_type === "NO_DATA") {
            outOfStock.push(result[i])
            continue;

          }

          //Sum prices
          for (let k = 0; k < result.length; k++) {
            p += JSON.parse(result[k].store_product_price)
          }

          const s = {
            OutOfStock: outOfStock,
            Deatils: resultStoreID[i],
            TotalPrice: Number(p.toFixed(2))
          }
          tempArrayStore.push(s)
        }
        console.log(tempArrayStore)
        SetStores(tempArrayStore)
        SetLoading(false)
      } catch (error) {
        console.log(error)
      }
    })()
  }, []);


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
      <RingLoader
        css={override}
        size={80}
        color={'#36d7af'}
        loading={loading}
      />
      {!loading && <GoogleMaps Stores={stores} />}
      {/* {stores.length === 0 && <div>לא נמצאו סופרים במיקום המבוקש </div>} */}

    </Dialog>
  )
}

const data = {
  TestFunction: {
    action: "TestFunction"
  },
  GetChains: {
    action: "GetChains"
  },
  GetStoresByChain: {
    action: "GetStoresByChain", chain_id: '', sub_chain_id: '', limit: 10
  },
  GetStoresByCityID: {
    action: "GetStoresByCityID", city_id: '', limit: 10
  },
  GetStoresByGPS: {
    action: "GetStoresByGPS", latitude: '', longitude: '', km_radius: '', order:1, limit: 10
  },
  GetProductsByBarCode: {
    action: "GetProductsByBarCode", product_barcode: '', limit: 3
  },
  GetProductsByID: {
    action: 'GetProductsByID', product_id: '', limit: 10
  },
  GetProductsByName: {
    action: "GetProductsByName", product_name: "", limit: 5
  },
  GetPrice: {
    action: "GetPrice", store_id: '', limit: 10
  },
  GetPriceByProductBarCode: {
    action: "GetPriceByProductBarCode", store_id: '', 'product_barcode[]': []
  },
  GetPriceByProductID: {
    action: "GetPriceByProductID", store_id: '', product_id: ''
  },
  GetHistoryByProductBarCode: {
    action: "GetHistoryByProductBarCode", store_id: '', product_barcode: '', from_date: '', to_date: ''
  },
  GetHistoryByProductID: {
    action: "GetHistoryByProductID", store_id: '', product_id: '', from_date: '', to_date: ''
  },
  GetCities: {
    action: "GetCities", limit: 10
  },
  GetCityByName: {
    action: "GetCityByName", city_name: '', limit: 1
  }
}
