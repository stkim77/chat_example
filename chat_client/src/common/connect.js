import io from 'socket.io-client';

const socket = io('http://localhost:4001');

export const addUser = (userName) => {
    socket.emit('enter user', userName);
};

export const sendChatMessage = (contents) => {
    socket.emit('message', contents);
};

export const sendChatImage = (contents) => {
    socket.emit('image', contents);
};

export const joinRoom = (room) => {
    socket.emit('join room', room);
};

export const leaveRoom = () => {
    socket.emit('leave room');
};

export const requestUserList = () => {
    socket.emit('request userlist');
};

export const inviteUser = (userID) => {
    socket.emit('invite user', userID);
};

export const acceptInvite = (contents) => {
    socket.emit('accept invite', contents);
};

export const addHandlerForChat = (onMessageReceived) => {
    socket.on('message', (data)=>{
        onMessageReceived(Object.assign({}, data, {owner:'other'}));
    });
};

export const removeHandlerForChat = () => {
    socket.off('message');
};

export const addHandlerForRooms = (onRoomsReceived) => {
    socket.on('rooms', onRoomsReceived);
};

export const removeHandlerForRooms = () => {
    socket.off('rooms');
};

export const addHandlerForUsers = (onUsersReceived) => {
    socket.on('users', onUsersReceived);
};

export const removeHandlerForUsers = () => {
    socket.off('users');
};

export const addHandlerForInvite = (onInviteReceived) => {
    socket.on('invite room', onInviteReceived);
};

export const removeHandlerForInvite = () => {
    socket.off('invite room');
};

export const addHandlerForNotEnter = (onNotEnter) => {
    socket.on('not enter', onNotEnter);
};

export const removeHandlerForNotEnter = () => {
    socket.off('not enter');
};