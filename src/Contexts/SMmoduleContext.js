import React, { createContext, useReducer, useEffect } from 'react'
import { SuperMarketModuleReducer } from './Reducers/SuperMarketModuleReducer'


export const SMmoduleContext = createContext();

const SMmoduleContextProvider = (props) => {

    const [smList, smListdispatch] = useReducer(SuperMarketModuleReducer, [], () => {

        const localSmListData = localStorage.getItem('smList');
        return localSmListData ? JSON.parse(localSmListData) : [];

    });

    useEffect(() => {
        localStorage.setItem('smList', JSON.stringify(smList));

    }, [smList]);

    const [myCartList, MyCartListDispatch] = useReducer(SuperMarketModuleReducer, [], () => {
        const localMyCartListData = localStorage.getItem('myCartList');
        return localMyCartListData ? JSON.parse(localMyCartListData) : [];
    });

    useEffect(() => {
        localStorage.setItem('myCartList', JSON.stringify(myCartList));
    }, [myCartList]);

    const [notTakenList, NotTakenListDispatch] = useReducer(SuperMarketModuleReducer, [], () => {
        const localnotTakenListData = localStorage.getItem('notTakenList');
        return localnotTakenListData ? JSON.parse(localnotTakenListData) : [];
    });

    useEffect(() => {
        localStorage.setItem('notTakenList', JSON.stringify(notTakenList));
    }, [notTakenList]);


    const SM_MODULE_DESTRUCTOR = {
        smList, smListdispatch,
        myCartList, MyCartListDispatch,
        notTakenList, NotTakenListDispatch
    }


    return (
        <SMmoduleContext.Provider value={SM_MODULE_DESTRUCTOR}>
            {props.children}
        </SMmoduleContext.Provider>
    );
}
export default SMmoduleContextProvider;


