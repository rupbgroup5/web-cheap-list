import React, { createContext } from 'react';


export const IsLocalContext = createContext();

const IsLocalContextProvider = (props) => {
    let isLocal = false;


    return (
        <IsLocalContext.Provider value={{ isLocal }}>
            {props.children}
        </IsLocalContext.Provider>
    );
}
export default IsLocalContextProvider;


