const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const R = require('ramda');
const port = 4001;

const rooms = ['Room1', 'Room2', 'Room3', 'Room4', 'Room5'];

io.on('connection', function(socket){
    console.log(`user connected [id:${socket.id}]`);

    socket.on('enter user', (username) => {
        console.log(`enter user:[${username}]`);
        socket.username = username;
        socket.emit('rooms', {
            rooms
        });
    });

    socket.on('join room', (room) => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`join room [${socket.username}-${room}]`);
        socket.room = room;
        socket.join(room);
        socket.broadcast.to(socket.room).emit('message', {
            type        : 'announce',
            contents    : `[${socket.username}]님이 입장하셨습니다.`
        });
    });

    socket.on('leave room', () => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`leave room [${socket.username}-${socket.room}]`);
        const room = socket.room;
        socket.room = ''
        socket.leave(room);
        socket.broadcast.to(room).emit('message', {
            type        : 'announce',
            contents    : `[${socket.username}]님이 퇴장하셨습니다.`
        });
    });

    socket.on('message', (data) => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`message from [${socket.id}-${socket.username}]`);
        console.log(data);
        socket.broadcast.to(socket.room).emit('message', {
            userID      : socket.id,
            username    : socket.username,
            type        : 'text',
            contents    : data
        });
    });

    socket.on('image', (data) => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`image from [${socket.id}-${socket.username}]`);
        socket.broadcast.to(socket.room).emit('message', {
            userID      : socket.id,
            username    : socket.username,
            type        : 'image',
            contents    : data
        });
    });

    socket.on('request userlist', () => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`request userlist from [${socket.id}-${socket.username}]`);
        let allUsers = io.sockets.clients('');
        const pickFunc = R.pickAll(['id', 'username', 'room']);
        const filterFunc = R.where({
            username    : R.compose(R.not, R.isNil),
            room        : R.compose(R.not, R.equals(socket.room), R.defaultTo(''))
        });
        let users = R.compose(R.map(pickFunc), R.filter(filterFunc), R.values, R.prop('sockets'))(allUsers);
        // console.log(users);
        socket.emit('users', {
            users
        });
    });

    socket.on('invite user', (userID) => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }

        console.log(`invite user from [${socket.id}-${socket.username}] to [${userID}]`);
        let allUsers = io.sockets.clients('');
        const {id, room, connected} = R.compose(R.pickAll(['id', 'room', 'connected']), R.defaultTo({}), R.prop(userID), R.prop('sockets'))(allUsers);

        if ( !R.isNil(id) && connected && !R.equals(room, socket.room)) {
            io.to(userID).emit('invite room', {username : socket.username, room : socket.room});
        }
    });

    socket.on('accept invite', (data) => {
        if (R.isNil(socket.username) || R.isEmpty(socket.username)) {
            console.log('not enter user request');
            socket.emit('not enter');
            return;
        }
        
        console.log(`accept invite from [${socket.id}-${socket.username}] to [room : ${data.room}]`);
        if (!R.equals(socket.room, data.room)) {
            if (!R.isNil(socket.room)) {
                const room = socket.room;
                socket.leave(room);
                socket.broadcast.to(room).emit('message', {
                    type        : 'announce',
                    contents    : `[${socket.username}]님이 퇴장하셨습니다.`
                });        
            }
            socket.room = data.room;
            socket.join(socket.room);
            socket.broadcast.to(socket.room).emit('message', {
                type        : 'announce',
                contents    : `[${data.username}]님이 [${socket.username}]님을 초대하였습니다.`
            });    
        }
    });

    socket.on('disconnect', () => {
        console.log(`disconnect [${socket.id} : ${R.compose(R.defaultTo('NO USERNAME'), R.prop('username'))(socket)}]`);
    });
});

http.listen(port, () => console.log(`listening on *: ${port}`) );
