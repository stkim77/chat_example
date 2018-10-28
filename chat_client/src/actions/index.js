import ActionEnum from './ActionEnum';
import { SCENE, POPUP } from '../common/Enum';
import * as Socket from '../common/connect';

export {
    ActionEnum
};

export const login = (user) => {
    return {
        type        : ActionEnum.LOG_IN,
        contents    : {...user, isLogged : true}
    };
};

export const resetUser = () => {
    return {
        type        : ActionEnum.RESET_USER
    };
};

export const addHistory = (chat) => {
    return {
        type        : ActionEnum.RECEIVE_CHAT,
        contents    : chat
    };
};

export const resetHistory = () => {
    return {
        type        : ActionEnum.RESET_CHAT
    };
};

export const setScene = (scene=SCENE.ROOM_LIST) => {
    return {
        type        : ActionEnum.SET_SCENE,
        contents    : scene
    };
};

export const setPopUp = (popup=POPUP.NONE) => {
    return {
        type        : ActionEnum.SET_POPUP,
        contents    : popup
    };
};

export const receiveRoomList = (data) => {
    return {
        type        : ActionEnum.RECEIVE_ROOM_LIST,
        contents    : data.rooms
    };
};

export const resetRoomList = () => {
    return {
        type        : ActionEnum.RESET_ROOM_LIST
    };
};

export const receiveUserList = (data) => {
    return {
        type        : ActionEnum.RECEIVE_USER_LIST,
        contents    : data.users
    };
};

export const resetUserList = () => {
    return {
        type        : ActionEnum.RESET_USER_LIST
    };
};

export const setSelectRoomName = (name) => {
    return {
        type        : ActionEnum.SET_ROOM_NAME,
        contents    : {name}
    };
};

export const resetRoomName = () => {
    return {
        type        : ActionEnum.RESET_ROOM_NAME
    };
};

export const enterRoom = (roomName) => {
    return (dispatch, getState)=>{
        dispatch(setSelectRoomName(roomName));
        return dispatch(setScene(SCENE.ROOM));
    };
};

export const exitRoom = (roomName) => {
    return (dispatch, getState)=>{
        dispatch(resetRoomName());
        dispatch(resetHistory());
        return dispatch(setScene(SCENE.ROOM_LIST));
    };
};

export const receiveInvite = (data) => {
    return (dispatch, getState)=>{
        dispatch(setSelectRoomName(data.room));
        dispatch(setPopUp(POPUP.NONE));
        dispatch(receiveUserList({users:[]}));
        Socket.acceptInvite(data);
        return dispatch(setScene(SCENE.ROOM));
    };
};

export const resetStoreInfo = () => {
    return (dispatch, getState)=>{
        dispatch(setPopUp(POPUP.NONE));
        dispatch(resetUser());
        dispatch(resetRoomList());
        dispatch(resetHistory());
        dispatch(resetUserList());
        dispatch(resetRoomName());
        return dispatch(setScene(SCENE.ROOM_LIST));
    };
};
