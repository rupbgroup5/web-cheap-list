import React, { createContext, useState } from 'react';


export const IsAdminContext = createContext();

const IsAdminContextProvider = (props) => {
    const [isAdmin, SetIsAdmin] = useState();


    return (
        <IsAdminContext.Provider value={{ isAdmin, SetIsAdmin }}>
            {props.children}
        </IsAdminContext.Provider>
    );
}
export default IsAdminContextProvider;


