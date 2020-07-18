import * as userActions from './ActionTypes'
let lastId = 0;

// remmeber ! state is coming from the context api and 
//when using the reducer outside you pass the action object alone 

export const smListReducer = (state, action) => {

    //  const {} = userActions;
    switch (action.type) {
        case userActions.AddItem:
            // calling it will be:
            //smListdispatch({ type: userActions.AddItem , newItem: {name: 'חלב'}});
            return [
                ...state,
                {
                    id: ++lastId,
                    name: action.newItem.name
                }
            ]
        case userActions.RemoveItem:
            // calling it will be:
            //smListdispatch({ type: userActions.RemoveItem , id2remove: 2 });
            return state.filter((item) => item.id !== action.id2remove);
        case userActions.RemoveAll:
            return state = [];
        default:
            return state;
    }
}

