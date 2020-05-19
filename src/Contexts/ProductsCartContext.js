import React, { createContext, useState } from 'react';
import '../Styles/SuperMarketListStyle.css'

export const ProductsCartContext = createContext();

const ProductsCartContextProvider = (props) => {
    const [productCart, SetProductCart] = useState([]);

    return (
        <ProductsCartContext.Provider value={{ productCart, SetProductCart }}>
            {props.children}
        </ProductsCartContext.Provider>
    );
}
export default ProductsCartContextProvider;


