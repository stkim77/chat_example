let io = require('socket.io-client');
const R = require('ramda');
let assert = require('assert');

const socketURL = 'http://localhost:4001';
const socketOptions = {
    transports              : ['websocket'],
    'force new connection'  : true
};

describe('socket server test', function() {
    let socket1 = null;
    let socket2 = null;
    // beforeEach ((done)=>{
    //     socket1 = io.connect(socketURL, socketOptions);
    //     socket2 = io.connect(socketURL, socketOptions);
    //     socket2.on('connect', () => { 
    //         done();
    //     }); 
    // });

    afterEach((done) => {
        // Cleanup
        if(!R.isNil(socket1) && socket1.connected) {
            socket1.disconnect();
        }
        if(!R.isNil(socket2) && socket2.connected) {
            socket2.disconnect();
        }
        done();
    });

    //- enter user
    //  response : room list [to : request socket]
    it('enter user test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => { 
                assert(R.equals(data.rooms, ['Room1', 'Room2', 'Room3', 'Room4', 'Room5']));
                done();
            }); 
            socket1.emit('enter user', 'test1');    
        });
    });

    // - join room
    //   response : announce about join msg [to : broadcast in room]
    it('join room test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('message', (data)=>{
                const contents = R.prop('contents', data);
                const index = contents.search('입장');
                // console.log(data);
                // console.log(index);
                assert( (R.compose(R.equals('announce'), R.prop('type'))(data) && index > 0));
                done();
            });
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket2.emit('join room', 'Room1');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });           
    });

    // - leave room
    //   response : announce leave join msg [to : broadcast in room]
    it('leave room test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('message', (data)=>{
                            // console.log(data);
                            socket2.on('message', (data)=>{
                                const contents = R.prop('contents', data);
                                const index = contents.search('퇴장');
                                // console.log(data);
                                // console.log(index);
                                assert( (R.compose(R.equals('announce'), R.prop('type'))(data) && index > 0));
                                done();
                            });
                            socket1.emit('leave room');
                        });
                        socket2.emit('join room', 'Room1');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

    // - message
    //   response : send message [to : broadcast in room]
    it('message test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('message', (data)=>{
                            socket2.on('message', (data)=>{
                                // console.log(data);
                                assert.equal( R.prop('type', data), 'text' );
                                done();
                            });
                            socket1.emit('message', '테스트 메세지');
                        });
                        socket2.emit('join room', 'Room1');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

    // - image
    //   response : send image [to : broadcast in room]
    it('image test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('message', (data)=>{
                            socket2.on('message', (data)=>{
                                // console.log(data);
                                assert.equal( R.prop('type', data), 'image' );
                                done();
                            });
                            socket1.emit('image', 'test image');
                        });
                        socket2.emit('join room', 'Room1');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

    // - request userlist
    //   response : user list [to : request socket]
    it('request userlist test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('users', (data)=>{
                            // console.log(data);
                            assert.equal(R.path(['users', 0, 'username'],data), 'test2');
                            done();
                        });
                        socket1.emit('request userlist');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

    // - invite user
    //   response : send invite event [to : inviting socket]
    it('invite user test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('users', (data)=>{
                            socket2.on('invite room', (data)=>{
                                // console.log(data);
                                assert.equal(R.prop('username', data), 'test1');
                                done();
                            });
                            socket1.emit('invite user', R.path(['users', 0, 'id'],data));                                
                        });
                        socket1.emit('request userlist');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

    // - accept invite
    //   response : announce leave join msg [to : broadcast in room]
    //   response : announce about join msg [to : broadcast in room]
    it('accept invite test', (done) => {
        socket1 = io.connect(socketURL, socketOptions);
        socket1.on('connect', ()=>{
            socket1.on('rooms', (data) => {
                socket1.emit('join room', 'Room1');

                socket2 = io.connect(socketURL, socketOptions);
                socket2.on('connect', ()=>{
                    socket2.on('rooms', (data) => {
                        socket1.on('users', (data)=>{
                            socket2.on('invite room', (data)=>{
                                socket1.on('message', (data)=>{
                                    const contents = R.prop('contents', data);
                                    const index = contents.search('초대');
                                    // console.log(data);
                                    // console.log(index);
                                    assert( (R.compose(R.equals('announce'), R.prop('type'))(data) && index > 0));
                                    done();
                                });
    
                                socket2.emit('accept invite', data);
                            });
                            socket1.emit('invite user', R.path(['users', 0, 'id'],data));
                        });
                        socket1.emit('request userlist');
                    });
                    socket2.emit('enter user', 'test2');
                });
            });
            socket1.emit('enter user', 'test1');
        });
    });

});