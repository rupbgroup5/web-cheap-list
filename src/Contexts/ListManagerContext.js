import React, { createContext, useState } from 'react';

export const ListManagerContext = createContext();

const ListManagerContextProvider = (props) => {
    const [list, SetList] = useState([]);

    return (
        <ListManagerContext.Provider value={{ list, SetList }}>
            {props.children}
        </ListManagerContext.Provider>
    );
}
export default ListManagerContextProvider;
