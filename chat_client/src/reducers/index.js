import { combineReducers } from 'redux';
import { ActionEnum } from '../actions';
import { SCENE, POPUP } from '../common/Enum';

const userInitialState = {
    isLogged    : false,
    userName    : ""
};

const user = (state = userInitialState, action) => {
    switch (action.type) {
        case ActionEnum.LOG_IN:
            return Object.assign({}, state, action.contents);
        case ActionEnum.RESET_USER:
            return userInitialState;
        default:
            return state;
    }
};

// const testHistory = [
//     {
//         owner : 'mine',
//         type : 'text',
//         contents : 'test1111'
//     },
//     {
//         username : 'test',
//         owner : 'other',
//         type : 'text',
//         contents : 'test2222'
//     }
// ];
const chatHistory = (state = [], action) => {
    switch (action.type) {
        case ActionEnum.RECEIVE_CHAT:
            return [...state, action.contents];
        case ActionEnum.RESET_CHAT:
            return [];
        default:
            return state;
    }
};

const scene = (state=SCENE.ROOM_LIST, action) => {
    switch (action.type) {
        case ActionEnum.SET_SCENE:
            return action.contents;
        default:
            return state;
    }
};

const popup = (state=POPUP.NONE, action) => {
    switch (action.type) {
        case ActionEnum.SET_POPUP:
            return action.contents;
        default:
            return state;
    }
};

// const testRooms = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5'];
const rooms = (state=[], action) => {
    switch (action.type) {
        case ActionEnum.RECEIVE_ROOM_LIST:
            return action.contents;
        case ActionEnum.RESET_ROOM_LIST:
            return [];
        default:
            return state;
    }
};

const roomInitialState = {
    name            : ''
};
// const testRoomState = {
//     name            : 'Test Room'
// };
const selectRoom = (state=roomInitialState, action) => {
    switch (action.type) {
        case ActionEnum.SET_ROOM_NAME:
            return Object.assign({}, state, action.contents);
        case ActionEnum.RESET_ROOM_NAME:
            return roomInitialState;
        default:
            return state;
    }
};

// const testUsers = [
//     {
//         id : 'dafdsaf',
//         username : 'test'
//     }
// ];
const users = (state=[], action) => {
    switch (action.type) {
        case ActionEnum.RECEIVE_USER_LIST:
            return action.contents;
        case ActionEnum.RESET_USER_LIST:
            return [];
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    user,
    chatHistory,
    scene,
    popup,
    rooms,
    users,
    selectRoom
});

export { rootReducer };