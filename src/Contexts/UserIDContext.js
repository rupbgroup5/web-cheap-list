import React, { createContext, useState } from 'react';


export const UserIDContext = createContext();

const UserIDContextProvider = (props) => {
   const [userID, SetUserID ] = useState();
   const [userName, SetUserName] = useState(); 


    return (
        <UserIDContext.Provider value={{ userID, SetUserID, userName, SetUserName }}>
            {props.children}
        </UserIDContext.Provider>
    );
}
export default UserIDContextProvider;


