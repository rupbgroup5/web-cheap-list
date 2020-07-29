import React, { createContext, useState } from 'react';


export const NotificationsContext = createContext();

const NotificationsContextProvider = (props) => {
    const [notifications, SetNotifications] = useState([]);
    const [badge, Setbadge ] = useState(0)


    return (
        <NotificationsContext.Provider value={{ notifications, SetNotifications, badge, Setbadge }}>
            {props.children}
        </NotificationsContext.Provider>
    );
}
export default NotificationsContextProvider;


