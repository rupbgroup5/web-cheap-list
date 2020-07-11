import React, { useState, useEffect, useRef, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Circle from 'react-circle';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import ClearOutlinedIcon from '@material-ui/icons/ClearOutlined';

//SpedDial
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@material-ui/lab/';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import AddShoppingCartOutlinedIcon from '@material-ui/icons/AddShoppingCartOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

import swal from 'sweetalert'

//Styles
import '../Styles/ProductCartStyle.css'

//Context Api:
import { ListObjContext } from "../Contexts/ListDetailsContext";
import { IsLocalContext } from "../Contexts/IsLocalContext";
import { ProductsCartContext } from "../Contexts/ProductsCartContext";
import { PageTitleContext } from "../Contexts/PageTitleContext";



//Actions

import Location from '../Components/Actions/Location'
import SearchStores from '../Components/Actions/SearchStores';
import SuperMarketList from '../Components/Actions/SuperMarketList';
import SearchProduct from '../Components/Actions/SearchProduct'

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));





function AList() {
    const classes = useStyles();

    //Context API
    const { listObj } = useContext(ListObjContext);
    const { isLocal } = useContext(IsLocalContext);
    const { productCart, SetProductCart } = useContext(ProductsCartContext);
    const { SetPageTitle } = useContext(PageTitleContext);

    //SpeedDial
    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [location, SetLocation] = useState(listObj.Latitude === '' ? true : false)
    const [searchStores, SetSearchStores] = useState(false)
    const [superMarketList, SetSuperMarketList] = useState(false)
    const [searchProduct, SetSearchProduct] = useState(false);


    const [list, SetList] = useState(listObj);
    const [listName, SetListName] = useState(list.ListName)
    const textInput = useRef(null)
    const limitInput = useRef(null)
    const queryString = require('query-string');
    const [product, SetProduct] = useState([]);
    const [stores, SetStores] = useState([]);
    const [limit, SetLimit] = useState(list.LimitPrice)
    const [progressBar, SetProgressBar] = useState(0)
    const [implementLimit, SetimplementLimit] = useState(((list.ListEstimatedPrice / list.LimitPrice).toFixed(2)) * 100)
    const [color, SetColor] = useState("#009900")
    const [disableSave, SetDisableSave] = useState(true)
    
    let api = "https://api.superget.co.il?api_key=847da8607b5187d8ad1ea24fde8ee8016b19a6db&"
    let apiAppProduct = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppProduct/"
    let apiAppList = "http://proj.ruppin.ac.il/bgroup5/FinalProject/backEnd/api/AppList/"
    if (isLocal) {
        apiAppProduct = "http://localhost:56794/api/AppProduct/"
        apiAppList = "http://localhost:56794/api/AppList/"
    }

    let tempProduct = "";
    let tempName = "";
    let tempLimit = '';

    const updatePercentage = () => {
        setTimeout(() => {
            SetProgressBar(progressBar + 1);
        }, 30);
        if (progressBar > 50) {
            SetColor('#ff884d')
        }
        if (progressBar > 80) {
            SetColor("#ff3300")
        }
    };
    const updatePercentage2 = () => {
        setTimeout(() => {
            SetProgressBar(progressBar - 1);
        }, 30);
        if (progressBar <= 50) {
            SetColor("#009900")
        }
        if (progressBar > 50) {
            SetColor('#ff884d')
        }
        if (progressBar > 80) {
            SetColor("#ff3300")
        }
    }

    useEffect(() => {
        if (implementLimit > 0) updatePercentage();
    }, [implementLimit]);

    useEffect(() => {
        if (progressBar < implementLimit) updatePercentage();
        else if (progressBar > implementLimit) updatePercentage2();
    }, [progressBar]);

    useEffect(() => {

        localStorage.setItem('listObj', JSON.stringify(listObj));

        (async () => {
            try {
                const res = await fetch(apiAppProduct + listObj.ListID, {
                    method: 'GET',
                    headers: new Headers({
                        'Content-Type': 'application/json; charset=UTF-8',
                    }),
                })
                let result = await res.json();
                SetProductCart(result)
            } catch (error) {
                console.log(error)
            }
        }
        )();
        SetPageTitle('סל קניות')
    }, [listObj, apiAppProduct, SetProductCart, SetPageTitle]);

    const editListName = (e) => {
        tempName = "";
        tempName = e.target.value
    }

    const Confirmation = () => {
        console.log('is ', tempName)
        if (tempName !== "") {
            swal({
                title: "שינוי שם הרשימה",
                buttons: ['התחרטתי', 'שנה את השם'],
                dangerMode: true,
            })
                .then((userInput) => {
                    if (userInput) {
                        console.log(tempName)
                        let l = {
                            ListID: list.ListID,
                            ListName: tempName
                        }
                        fetch(apiAppList, {
                            method: 'PUT',
                            headers: new Headers({
                                'Content-type': 'application/json; charset=UTF-8'
                            }),
                            body: JSON.stringify(l)
                        }).then(res => { return res.json(); })
                            .then(
                                (result) => {
                                    SetListName(tempName)
                                    list.ListName = listName
                                    console.log('The name of ', result, ' id was changed')
                                    swal('שם הקבוצה שונה');
                                },
                                (error) => {
                                    console.log(error)
                                })
                    } else {
                        textInput.current.value = ""
                    }
                })
        }
    }


    const handleClickAction = (action) => {
        console.log(action);

        if (action === 'מיקום') {
            SetLocation(true)
        } else if (action === 'חפש סופרים') {
            SetSearchStores(true)
        } else if (action === 'רשימה בסופר') {
            SetSuperMarketList(true)
        }
        else if (action === 'חפש מוצר') {
            SetSearchProduct(true);
        }

    }

    const handleLimit = (e) => {
        console.log(tempLimit)
        if (e === '') {
            limitInput.current.value = ''
        }
        tempLimit = e.target.value

    }

    const handleClickLimit = async () => {
        try {
            const res = await fetch(apiAppList + "limit/" + tempLimit + '/' + list.ListID, {
                method: 'PUT',
            })
            let result = await res.json();
            SetLimit(tempLimit);
            SetimplementLimit(((list.ListEstimatedPrice / tempLimit).toFixed(2)) * 100)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    //const handleProduct = (e) => { tempProduct = e.target.value }

    // const handleClickChoise = async () => {
    //     if (list.CityName !== null && tempProduct !== '') {
    //         try {
    //             //get cityID
    //             data.GetCityByName.city_name = list.CityName
    //             let query = queryString.stringifyUrl({ url: api, query: data.GetCityByName })
    //             let resCity = await fetch(query, { method: 'GET' })
    //             let resultCity = await resCity.json();
    //             console.log('resultCity', resultCity)
    //             //get productBarcode
    //             data.GetProductsByName.product_name = tempProduct;
    //             query = queryString.stringifyUrl({ url: api, query: data.GetProductsByName })
    //             let resBarcode = await fetch(query, { method: 'GET' })
    //             let resultBarcode = await resBarcode.json();
    //             console.log('product', resultBarcode)
    //             //getStoreByCityID
    //             data.GetStoresByCityID.city_id = resultCity[0].city_id
    //             query = await queryString.stringifyUrl({ url: api, query: data.GetStoresByCityID })
    //             let resStoreID = await fetch(query, { method: 'GET' })
    //             let resultStoreID = await resStoreID.json()
    //             let arrayProduct = []
    //             for (let i = 0; i < resultBarcode.length; i++) {
    //                 let price = 0;
    //                 let count = 0;
    //                 for (let j = 0; j < resultStoreID.length; j++) {
    //                     data.GetPriceByProductBarCode.store_id = resultStoreID[j].store_id
    //                     data.GetPriceByProductBarCode.product_barcode = resultBarcode[i].product_barcode
    //                     query = await queryString.stringifyUrl({ url: api, query: data.GetPriceByProductBarCode })
    //                     let resPrice = await fetch(query, { method: 'GET' })
    //                     let resultPrice = await resPrice.json();
    //                     if (resultPrice.error_type === "NO_DATA") {
    //                         console.log('err')
    //                         continue;
    //                     }
    //                     price += JSON.parse(resultPrice[0].store_product_price)
    //                     count++
    //                 }
    //                 price = price / count

    //                 console.log('my price', price)
    //                 //Get SRCIMG
    //                 let resSRC = await fetch("http://localhost:56794/api/Scraper/" + resultBarcode[i].product_name, { method: 'GET' })
    //                 let resultSRC = await resSRC.json();
    //                 let p = {
    //                     product_barcode: resultBarcode[i].product_barcode,
    //                     product_name: resultBarcode[i].product_name,
    //                     product_description: resultBarcode[i].product_description,
    //                     product_image: resultSRC,
    //                     manufacturer_name: resultBarcode[i].manufacturer_name,
    //                     estimatedProductPrice: Number(price.toFixed(2))
    //                 }
    //                 arrayProduct.push(p)
    //             }
    //             SetProduct(...product, arrayProduct)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     } else alert('מלא את השדות תחילה')


    // }

    const ConfirmationLimit = (index) => {
        console.log(list.ListEstimatedPrice, product[index].estimatedProductPrice)
        let tempCheck = list.ListEstimatedPrice + product[index].estimatedProductPrice
        console.log('temp', tempCheck)
        console.log(list.ListEstimatedPrice, product[index].estimatedProductPrice)
        if (tempCheck > list.LimitPrice) {
            swal({
                text: "שים לב! חרגת מהמגבלה",
                buttons: ['בטל', 'המשך בכל זאת'],
                dangerMode: true,
            }).then((willContinue) => {
                if (willContinue) {
                    Add2DB(index)
                }
            })
        } else if (tempCheck > list.LimitPrice * 0.7) {
            alert('שים לב! עברת 70% מהמגבלה')
            Add2DB(index)
        }
        else Add2DB(index)
    }

    const Add2DB = async (index) => {

        let p = {
            ...product[index],
            ListID: list.ListID,
            GroupID: list.GroupID
        }
        const resDB = await fetch(apiAppProduct, {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json; charset=UTF-8'
            }),
            body: JSON.stringify(p)
        })
        const resultDB = await resDB.json()
        console.log('result', resultDB)
        list.ListEstimatedPrice += resultDB.estimatedProductPrice
        SetList(list)
        SetProduct([])
        SetProductCart([...productCart, resultDB])
        alert('המוצר התווסף בהצלחה')
    }

    // const getTotalPrice = async () => {
    //     try {
    //         //getCityID
    //         data.GetCityByName.city_name = list.CityName
    //         console.log(list.CityName);

    //         let query = queryString.stringifyUrl({ url: api, query: data.GetCityByName })
    //         console.log('0')
    //         let resCity = await fetch(query, { method: 'GET' })
    //         let resultCity = await resCity.json();
    //         console.log('1')
    //         //getStorebycityId
    //         data.GetStoresByCityID.city_id = resultCity[0].city_id
    //         query = await queryString.stringifyUrl({ url: api, query: data.GetStoresByCityID })
    //         let resStoreID = await fetch(query, { method: 'GET' })
    //         let resultStoreID = await resStoreID.json();
    //         console.log('2')
    //         let tempArrayStore = []

    //         for (let i = 0; i < resultStoreID.length; i++) {
    //             let p = 0;
    //             let outOfStock = [];
    //             for (let j = 0; j < productCart.length; j++) {
    //                 data.GetPriceByProductBarCode.product_barcode = productCart[j].product_barcode
    //                 data.GetPriceByProductBarCode.store_id = resultStoreID[i].store_id
    //                 query = queryString.stringifyUrl({ url: "https://cors-anywhere.herokuapp.com/" + api, query: data.GetPriceByProductBarCode })
    //                 const res = await fetch(query, { method: 'GET' })
    //                 var result = await res.json()
    //                 console.log('3')
    //                 if (result.error_type === "NO_DATA") {
    //                     alert('המוצר ' + productCart[j].product_name + ' לא קיים בחנות זו ')
    //                     outOfStock.push(productCart[j])
    //                     continue;

    //                 }
    //                 p += JSON.parse(result[0].store_product_price)
    //             }
    //             const s = {
    //                 OutOfStock: outOfStock,
    //                 Store: resultStoreID[i],
    //                 TotalPrice: Number(p.toFixed(2))
    //             }
    //             tempArrayStore.push(s)
    //         }
    //         SetStores(tempArrayStore)
    //         console.log('store', stores)
    //         // history.push(`/ListSuperMarket`, { params:tempArrayStore })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const SearchSubstitute = async (indexS, indexO) => {

        console.log(stores[indexS].OutOfStock[indexO])
        let prodSubstitute = stores[indexS].OutOfStock[indexO];
        data.GetProductsByName.product_name = prodSubstitute.product_description
        let query = queryString.stringifyUrl({ url: api, query: data.GetProductsByName })
        let resBarcode = await fetch(query, { method: 'GET' })
        let resultBarcode = await resBarcode.json();
        let tempArray = []
        for (let i = 0; i < resultBarcode.length; i++) {
            data.GetPriceByProductBarCode.store_id = stores[indexS].store_id
            data.GetPriceByProductBarCode.product_barcode = resultBarcode[i].product_barcode
            query = await queryString.stringifyUrl({ url: api, query: data.GetPriceByProductBarCode })
            let resPrice = await fetch(query, { method: 'GET' })
            let resultPrice = await resPrice.json();
            console.log('a', resultPrice)
            if (resultPrice.product_barcode === prodSubstitute.product_barcode) {
                continue;
            }
            tempArray.push(resultPrice)
        }
        console.log(tempArray)
        if (tempArray.length !== 0) {
            SetProduct(tempArray)
        }


    }

    const DeleteProduct = (index, barcode, ListID) => {
        console.log(productCart[index])
        swal({
            title: "מחיקת פריט",
            text: "כל פריטי הרשימה ימחקו גם הם ",
            buttons: ['בטל', 'מחק'],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    fetch(apiAppProduct + barcode + '/' + ListID, {
                        method: 'DELETE',
                        headers: new Headers({
                            'Content-type': 'application/json; charset=UTF-8'
                        })
                    }).then(res => { return res.json(); })
                        .then(
                            (result) => {
                                console.log('The ', result, ' was successfully deleted!')
                                list.ListEstimatedPrice -= productCart[index].estimatedProductPrice.toFixed(2)
                                productCart.splice(index, 1)
                                SetProductCart([...productCart])
                                swal("המוצר נמחק ")
                            },
                            (error) => {
                                console.log(error)
                            })
                }
            });

    }

    const handleClose = () => {
        setOpenSpeedDial(false);
    }

    const handleOpen = () => { setOpenSpeedDial(true); }

    const CloseDialogLocation = () => { SetLocation(false) }

    const CloseDialogSearchStores = () => { SetSearchStores(false) }

    const CloseDialogSMList = () => { SetSuperMarketList(false) }

    const CloseDialogSearchProduct = () => { SetSearchProduct(false) }



    return (
        <div className="container">
            <div className="header">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    onInput={editListName}
                    placeholder={listName}
                    onBlur={Confirmation}
                    inputRef={textInput}
                />
            </div>
            <div className="Maincontent">
                {location && <Location CloseDialog={CloseDialogLocation} />}
                {searchStores && <SearchStores CloseDialog={CloseDialogSearchStores} />}
                {superMarketList && <SuperMarketList CloseDialog={CloseDialogSMList} />}
                {searchProduct && <SearchProduct CloseDialog={CloseDialogSearchProduct} />}


                {/* <h3>{list.CityName} </h3> */}
                {/* <input type={'text'} placeholder='הזן עיר חדשה' onChange={handleCity} /> &nbsp; */}
                {/* <button onClick={handleClickCity}>הגדר עיר לחיפוש </button> */}
                {/* <h3>{list.LimitPrice}</h3>
                <input type={'number'} placeholder='הזן מגבלה חדשה' onChange={handleLimit}></input> &nbsp;
                <button onClick={handleClickLimit}>הגדר מגבלה </button> <br /> <br /> <br /> <br />
                <input type={'text'} placeholder='בחר מוצר ' onChange={handleProduct} /> &nbsp;
                <button onClick={handleClickChoise}>חפש מוצר</button> */}
                {product.map((p, index) =>
                    <div key={index}>
                        <p>
                            {p.product_name} <b> במחיר</b> {p.estimatedProductPrice} &nbsp;
                            <img src={p.product_image} alt="" />
                            <button onClick={ConfirmationLimit(index)}>הוסף לרשימה</button>
                        </p>
                    </div>
                )}

                <div id="compareList">
                    {productCart.map((p, index) =>
                        <div key={index} className="product">
                            <div >
                                <ClearOutlinedIcon onClick={() => DeleteProduct(index, p.product_barcode, p.ListID)} fontSize='small' 
                                style={{ marginBottom: 80, marginLeft: -19, fill: 'darkgray' }} />
                                <img src={p.product_image} alt=" " />
                            </div>

                            <div className='product-text'>{p.product_description} <br /> במחיר  ₪{p.estimatedProductPrice} </div>
                        </div>
                    )}
                </div>
                <div className='product-text'>
                    {/* {productCart.length - 1 !== 0 ? 'סך מחיר משוער: ' + '₪' + Number(list.ListEstimatedPrice).toFixed(2) : false} */}
                 סך מחיר משוער: <b>₪{Number(list.ListEstimatedPrice).toFixed(2)}</b>
                </div>
                <br/>
                <Circle
                    animate={true} // Boolean: Animated/Static progress
                    animationDuration="0.15s" //String: Length of animation
                    size={100} // Number: Defines the size of the circle.
                    lineWidth={14} // Number: Defines the thickness of the circle's stroke.
                    progress={progressBar} // Number: Update to change the progress and percentage.
                    progressColor={color}  // String: Color of "progress" portion of circle.
                    //bgColor='Moccasin' // String: Color of "empty" portion of circle.
                    textColor={color} // String: Color of percentage text color.
                    textStyle={{
                        font: 'bold 5rem Helvetica, Arial, sans-serif' // CSSProperties: Custom styling for percentage.
                    }}
                    percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.

                />

                <br/>
                <TextField
                    type={'number'}
                    placeholder="הגדר מגבלה חדשה"
                    helperText={`מגבלה נוכחית: ${limit}`}
                    style={{ width: 150, marginRight: 20 }}
                    onFocus={() => { SetDisableSave(false) }}
                    onInput={handleLimit}
                    inputRef={limitInput}
                    onBlur={() => { tempLimit === '' ? SetDisableSave(true) : SetDisableSave(false) }}
                />
                <Button
                    color='primary'
                    size="small"
                    className={classes.button}
                    startIcon={<SaveIcon style={{ marginLeft: 3 }} />}
                    disabled={disableSave}
                    onClick={handleClickLimit}
                >
                    שמור
                </Button>

                <br /> <br />
                {/* <button onClick={getTotalPrice}>חפש סופרים בסביבתך</button> <br /><br /> */}
                {/* <b><u>רשימת הסופרים</u></b> */}
                {stores.map((s, indexS) =>
                    <div key={indexS}>
                        <div>
                            <b>{s.Store.store_name}</b> ברחוב {s.Store.store_address} <b>:עלות סל הקניות הוא </b> {s.TotalPrice} <br />
                            <u><small>המוצרים שחסרים הם</small></u>
                            {s.OutOfStock.map((o, indexO) =>
                                <p key={indexO}>
                                    <span>{o.product_name},</span>
                                    <button onClick={() => SearchSubstitute(indexS, indexO)} >חפש מוצר תחליפי</button>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="footer" >
                <SpeedDial
                    ariaLabel="SpeedDial"
                    icon={<SpeedDialIcon />}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    open={openSpeedDial}
                    direction="up"
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => handleClickAction(action.name)}
                        />
                    ))}
                </SpeedDial>

            </div>
        </div>
    )

}

export default withRouter(AList)

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
        action: "GetStoresByGPS", chain_id: '', sub_chain_id: '', latitude: '', longitude: '', km_radius: '', order: '', limit: 10
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

const actions = [
    { icon: <LocationOnOutlinedIcon />, name: "מיקום" },
    { icon: <AddShoppingCartOutlinedIcon />, name: "חפש מוצר" },
    { icon: <SearchOutlinedIcon />, name: "חפש סופרים" },
    { icon: <ListAltOutlinedIcon />, name: 'רשימה בסופר' }

];




