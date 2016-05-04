import { combineReducers } from 'redux';
import { STARTED } from '../Constants/ActionTypes';

const stateApp = function stateApp(previousState = '', action) {
    switch (action.type) {
        case STARTED:
            console.log('APP HAS STARTED!!!')
            return STARTED;
        default:
            return previousState;
    }
}

export default combineReducers({
    stateApp
});