import React, { createContext, useState } from 'react';


export const ListObjContext = createContext();

const ListDetailsContextProvider = (props) => {
    const [listObj, SetListObj] = useState({});


    return (
        <ListObjContext.Provider value={{ listObj, SetListObj }}>
            {props.children}
        </ListObjContext.Provider>
    );
}
export default ListDetailsContextProvider;


