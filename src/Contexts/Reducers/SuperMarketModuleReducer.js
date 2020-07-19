import { AddItem, RemoveItem, RemoveAll } from './ActionTypes'
let lastId = 0

// remmeber ! state is coming from the context api and 
//when using the reducer outside you pass the action object alone 

export const SuperMarketModuleReducer = (state, action) => {

    switch (action.type) {
        case AddItem:
            // calling it will be:
            //someDispatchFunction({ type: userActions.AddItem , newItem: {name: 'חלב'}});
            return [
                ...state,
                {
                    id: Date.now() + (Math.floor(Math.random() * 100) + 1) * (Math.floor(Math.random() * 100) + 1),
                    name: action.newItem.name
                }
            ]
        case RemoveItem:
            // calling it will be:
            //someDispatchFunction({ type: userActions.RemoveItem , id2remove: 2 });
            return state.filter((item) => item.id !== action.id2remove);
        case RemoveAll:
            return state = [];
        default:
            return state;
    }
}

