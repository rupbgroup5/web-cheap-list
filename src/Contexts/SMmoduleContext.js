import React, { createContext, useReducer, useEffect } from 'react'
import { smListReducer } from './Reducers/smListReducer'


export const SMmoduleContext = createContext();

const SMmoduleContextProvider = (props) => {

    const [smList, smListdispatch] = useReducer(smListReducer, [], () => {

        const localSmListData = localStorage.getItem('smList');
        return localSmListData ? JSON.parse(localSmListData) : [];

    });

    useEffect(() => {
        localStorage.setItem('smList', JSON.stringify(smList));

    }, [smList]);

    // const [myCartList, Set_myCartList] = useState([]);
    // const [notTakenList, Set_notTakenList] = useState([]);

    // const SM_ModuleDestructor = {
    //     smList, smListdispatch
    // };


    return (
        <SMmoduleContext.Provider value={{ smList, smListdispatch }}>
            {props.children}
        </SMmoduleContext.Provider>
    );
}
export default SMmoduleContextProvider;


