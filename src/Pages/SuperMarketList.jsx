import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';


//Context Api:
import { ProductsCartContext } from "../Contexts/ProductsCartContext";


const SuperMarketList = () => {
    const  { productCart } = useContext(ProductsCartContext); //SetProductCart

    return (
        <div>
            {console.log(productCart)}
           
            <ul>
            {productCart.map((p, index)=>{
                return <li key={index}>{p.product_name}</li>
            })}
            </ul>
        </div>
    )
}

export default withRouter(SuperMarketList);
