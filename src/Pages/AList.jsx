import React, { useState, useEffect, useRef } from 'react'
import { withRouter, useLocation } from 'react-router-dom';

import { TextField } from '@material-ui/core';

import swal from 'sweetalert';

//Styles
import '../Styles/HomeStyle.css';

function AList() {
    const location = useLocation()
    const list = location.state.list;
    const [listName, SetListName] = useState(list.ListName)
    const textInput = useRef(null)
    const queryString = require('query-string');
    const [price, setPrice] = useState(0);
    const [product, SetProduct] = useState([]);
    const [productCart, SetProductCart] = useState([]);
    let api = "https://api.superget.co.il?api_key=847da8607b5187d8ad1ea24fde8ee8016b19a6db&"
    let tempProduct = '';
    let tempName = '';
    let isLocal = true
    var apiAppProduct = "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd/api/AppList/"
    var apiAppList = "http://proj.ruppin.ac.il/bgroup5/FinalProject/frontEnd/api/AppList/"
    if (isLocal) {
        apiAppProduct = "http://localhost:56794/api/AppProduct"
        apiAppList = "http://localhost:56794/api/AppList/"
    }
    async function fetchMyAPI(list) {
        const res = await fetch(`http://localhost:56794/api/AppProduct/${list.ListID}`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            }),
        })
        let result = await res.json();
        SetProductCart(result)
    }

    useEffect(() => {
        fetchMyAPI(list)
    }, [list]);

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
            action: "GetStoresByGPS", chain_id: '', sub_chain_id: '', latitude: '', longitude: '', km_radius: '', order: '', limit: 10
        },
        GetProductsByBarCode: {
            action: "GetProductsByBarCode", product_barcode: '', limit: 10
        },
        GetProductsByID: {
            action: 'GetProductsByID', product_id: '', limit: 10
        },
        GetProductsByName: {
            action: "GetProductsByName", product_name: "", limit: 10
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
            action: "GetCityByName", city_name: '', limit: 10
        }
    }

    const handleProduct = (e) => {
        tempProduct = e.target.value
    }

    const handleClickChoise = async () => {
        SetProduct([...product, tempProduct])
        console.log(product)
        data.GetProductsByName.product_name = tempProduct;
        data.GetProductsByName.limit = 1
        try {
            const query = queryString.stringifyUrl({ url: api, query: data.GetProductsByName })
            const resApi = await fetch(query, { method: 'GET' })
            let result = await resApi.json();
            console.log('product', result)
            result[0] ={
                ...result[0], 
                ListID:list.ListID,
                GroupID:list.GroupID
            }
            console.log('before',result[0])
            const resDB = await fetch(apiAppProduct,{
                method:'POST',
                headers: new Headers({
                    'Content-type': 'application/json; charset=UTF-8'
                  }),
                  body: JSON.stringify(result[0])
            })
            const resultDB = await resDB.json() 
             SetProductCart([...productCart, resultDB])
        } catch (error) {
            console.log(error)
        }

    }

    const getTotalPrice = async () => {
        let p = 0;
        for (let i = 0; i < productCart.length; i++) {
            data.GetPriceByProductBarCode.product_barcode = productCart[i].product_barcode
            data.GetPriceByProductBarCode.store_id = 8
            try {
                const query = queryString.stringifyUrl({ url: api, query: data.GetPriceByProductBarCode })
                const res = await fetch(query, { method: 'GET' })
                var result = await res.json()
                if (result.error_type === "NO_DATA") {
                    alert('המוצר ' + productCart[i].product_name + ' לא קיים בחנות זו ')
                    break;
                }
            } catch (error) {
                console.log(error)
                break;
            }
            console.log('JSON', result[0].store_product_price)
            p += JSON.parse(result[0].store_product_price)
            console.log('resultPrice', result[0])
            console.log("price is ", p)
        }
        setPrice(p)
    }

    const editListName = (e) => {
        tempName = "";
        tempName = e.target.value
    }

    const Confirmation = () => {
        console.log(tempName)
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



    return (
        <div className="container">
            {console.log(list.ListID)}
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
                <br />
                <input type={'text'} placeholder='בחר מוצר ' onChange={handleProduct} />
                <button onClick={handleClickChoise}>בחור מוצר</button>
                <br />
            מוצרים <br />
            {console.log(productCart)}

                {productCart.map((p, index) =>
                    <div key={index}>
                        <p >{p.product_name} שם המוצר:</p>
                       {productCart.length - 1 === index ? 'המחיר הוא המשוער הוא  ' + p.EstimatedPrice : false}
                    </div>
                )
                }
                



                <br />
                <button onClick={getTotalPrice}>תן לי את המחיר הזול ביותר </button> <br /><br />
                המחיר הזול ביותר: {price} 
            </div>
            <div className="footer">

            </div>
        </div>







    )
}
export default withRouter(AList)
