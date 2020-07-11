import React, { createContext, useState } from 'react';

export const PageTitleContext = createContext();

const PageTitleContextProvider = (props) => {
    const [pageTitle, SetPageTitle] = useState('הקבוצות שלי');

    return (
        <PageTitleContext.Provider value={{ pageTitle, SetPageTitle }}>
            {props.children}
        </PageTitleContext.Provider>
    );
}
export default PageTitleContextProvider;


