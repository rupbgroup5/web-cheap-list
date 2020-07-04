import React, { createContext, useState } from 'react';


export const UserIDContext = createContext();

const UserIDContextProvider = (props) => {
   const [userID, SetUserID] = useState(); 


    return (
        <UserIDContext.Provider value={{ userID, SetUserID }}>
            {props.children}
        </UserIDContext.Provider>
    );
}
export default UserIDContextProvider;


