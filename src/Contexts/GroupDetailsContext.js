import React, { createContext, useState } from 'react';


export const GroupDetailsContext = createContext();

const GroupDetailsContextProvider = (props) => {
    const [groupDetails, SetGroupDetails] = useState();


    return (
        <GroupDetailsContext.Provider value={{ groupDetails, SetGroupDetails }}>
            {props.children}
        </GroupDetailsContext.Provider>
    );
}
export default GroupDetailsContextProvider;


