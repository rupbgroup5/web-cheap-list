import React, { useState, forwardRef, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Card from 'react-bootstrap/Card'
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { css } from "@emotion/core";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import swal from 'sweetalert'


//ContextApi
import { ProductsCartContext } from "../../Contexts/ProductsCartContext";
import { ListObjContext } from "../../Contexts/ListDetailsContext";
import { IsLocalContext } from "../../Contexts/IsLocalContext";


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
}));

const Transition = forwardRef((props, ref) => {
  return <Slide direction="left" ref={ref} {...props} />;
});




export default function SearchProduct(props) {
  const classes = useStyles();

  //ContextApi
  const { productCart, SetProductCart } = useContext(ProductsCartContext);
  const { listObj } = useContext(ListObjContext);
  const { isLocal } = useContext(IsLocalContext);

  const [loading, SetLoading] = useState(false)
  const [open, setOpen] = useState(true);
  const [numItem, SetNumItem] = useState({
    '0': 1,
    '1': 1,
    '2': 1,
    '3': 1,
    '4': 1,
    '5': 1,
    '6': 1,
    '7': 1,
    '8': 1
  })
  const [product, SetProduct] = useState([]);

  const queryString = require('query-string');

  let superGetAPI = `https://api.superget.co.il?api_key=${process.env.REACT_APP_SUPERGET_KEY}&`
  let apiAppProduct = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppProduct/"
  let apiScrapper = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/Scraper/"
  console.log(superGetAPI)

  if (isLocal) {
    apiAppProduct = "http://localhost:56794/api/AppProduct/";
    apiScrapper = "http://localhost:56794/api/Scraper/"
  }


  const override = css`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
  
 ;`;

  let tempProduct = '';



  const AddItem = (index) => {
    numItem[index] += 1;
    SetNumItem({ ...numItem })
  }

  const RemoveItem = (index) => {
    if (numItem[index] !== 1) {
      numItem[index] -= 1;
      SetNumItem({ ...numItem })
    }
  }

  const Add2DB = async (p) => {

    let product = {
      ...p,
      ListID: listObj.ListID,
      GroupID: listObj.GroupID
    }
    console.log(product)
    const resDB = await fetch(apiAppProduct, {
      method: 'POST',
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8'
      }),
      body: JSON.stringify(product)
    })
    const resultDB = await resDB.json()
    console.log('result', resultDB)
    listObj.ListEstimatedPrice += resultDB.estimatedProductPrice
    //SetList(list)
    SetProduct([])
    SetProductCart([...productCart, resultDB])
    alert('המוצר התווסף בהצלחה')
  }

  const ConfirmationLimit = (p) => {
    let tempCheck = listObj.ListEstimatedPrice + p.estimatedProductPrice
    if (tempCheck > listObj.LimitPrice) {
      swal({
        text: "שים לב! חרגת מהמגבלה",
        buttons: ['בטל', 'המשך בכל זאת'],
        dangerMode: true,
      }).then((willContinue) => {
        if (willContinue) {
          Add2DB(p)
        }
      })
    } else if (tempCheck > listObj.LimitPrice * 0.7) {
      alert('שים לב! עברת 70% מהמגבלה')
      Add2DB(p)
    }
    else Add2DB(p)
  }

  const handleProduct = (e) => { tempProduct = e.target.value }

  const handleClickSearch = async () => {
    SetLoading(true);
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
      let resultStoreID = await resStoreID.json();
      console.log('resultStoreId', resultStoreID)

      //get productBarcode
      data.GetProductsByName.product_name = tempProduct;
      query = queryString.stringifyUrl({ url: superGetAPI, query: data.GetProductsByName })
      let resBarcode = await fetch(query, { method: 'GET' })
      let resultBarcode = await resBarcode.json();
      console.log('product', resultBarcode)
      let arrayProduct = []
      //GetNameProduct
      let productsNamesArr = []
      for (let i = 0; i < resultBarcode.length; i++) {
        productsNamesArr.push(resultBarcode[i].product_name)
      }
      //Get SRCIMG
      const resSRC = await fetch(apiScrapper, {
        method: 'POST',
        headers: new Headers({
          'Content-type': 'application/json; charset=UTF-8'
        }),
        body: JSON.stringify(productsNamesArr)
      })
      let resultSRC = await resSRC.json();
      for (let i = 0; i < resultBarcode.length; i++) {
        let price = 0;
        let count = 0;
        //GetPriceByProductBarcode
        for (let j = 0; j < resultStoreID.length; j++) {
          data.GetPriceByProductBarCode.store_id = resultStoreID[j].store_id
          data.GetPriceByProductBarCode.product_barcode = resultBarcode[i].product_barcode
          query = await queryString.stringifyUrl({ url: superGetAPI, query: data.GetPriceByProductBarCode })
          if (j >= resultStoreID.length / 2) {
            query = await queryString.stringifyUrl({ url: 'https://allow-any-origin.appspot.com/' + superGetAPI, query: data.GetPriceByProductBarCode })
          }
          let resPrice = await fetch(query, { method: 'GET' })
          let resultPrice = await resPrice.json();
          if (resultPrice.error_type === "NO_DATA") continue;

          price += JSON.parse(resultPrice[0].store_product_price)
          count++
        }
        price = price / count


        let p = {
          product_barcode: resultBarcode[i].product_barcode,
          product_name: resultBarcode[i].product_name,
          product_description: resultBarcode[i].product_description,
          product_image: resultSRC[i],
          manufacturer_name: resultBarcode[i].manufacturer_name,
          estimatedProductPrice: Number(price.toFixed(2))
        }
        arrayProduct.push(p)
      }
      SetLoading(false)
      SetProduct(...product, arrayProduct)
    } catch (error) {
      console.log(error)
    }


  }



  const handleClose = () => {
    setOpen(false);
    props.CloseDialog()
    props.Implment();
  };



  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}  >
      {console.log(loading)}
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            חפש מוצר
            </Typography>
        </Toolbar>
      </AppBar>

      <ClimbingBoxLoader
        css={override}
        size={20}
        color={'#36d7af'}
        loading={loading}
      />
      <div className="container">
        <div className="header">
          <input placeholder='הקלד מוצר לחיפש' dir='rtl' onChange={handleProduct} /> <br />
          <button onClick={handleClickSearch}>חפש מוצר</button>
        </div>
        <div className="Maincontent">

          {!loading && <div className='productSerarch'>
            {
              product.map((p, index) =>
                <Card key={index}    >
                  <Card.Img variant="top" src={p.product_image} style={{ width: '50%' }} />
                  <Card.Body>
                    <Card.Title className='product-text'>{p.product_description}</Card.Title>
                    <Card.Text className='product-text'>
                      מחיר: ₪{p.estimatedProductPrice}
                    </Card.Text>
                    <AddIcon style={{ height: '0.7em' }} onClick={() => AddItem(index)} />
                    <label style={{ margin: 20, fontSize: '20px' }}>{numItem[index]}</label>
                    <RemoveIcon style={{ height: '0.7em' }} onClick={() => RemoveItem(index)} />
                    <br />

                    <Button ovariant="primary" color='primary' onClick={() => ConfirmationLimit(p)} >הוסף מוצר</Button>
                  </Card.Body>
                  <br />
                </Card>

              )
            }
          </div>}

        </div>
      </div>
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
    action: "GetStoresByCityID", city_id: '', limit: 3
  },
  GetStoresByGPS: {
    action: "GetStoresByGPS", chain_id: '', sub_chain_id: '', latitude: '', longitude: '', km_radius: '', order: '', limit: 3
  },
  GetProductsByBarCode: {
    action: "GetProductsByBarCode", product_barcode: '', limit: 10
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
    action: "GetPriceByProductBarCode", store_id: '', product_barcode: ''
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


