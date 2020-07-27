import React, { createContext, useState } from 'react';


export const NotificationsContext = createContext();

const NotificationsContextProvider = (props) => {
    const [notifications, SetNotifications] = useState([]);


    return (
        <NotificationsContext.Provider value={{ notifications, SetNotifications }}>
            {props.children}
        </NotificationsContext.Provider>
    );
}
export default NotificationsContextProvider;


