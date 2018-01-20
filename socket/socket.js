var farmers = [];
var farms = [];

exports.initialize = function(io, farmerId, farms) {

    let flag = 0;

    for(let i = 0; i < farmers.length; i++) {
        if(farmers[i].toString() == farmerId.toString()) {
            flag = 1;
        }
    }

    if(flag == 0) {

        farmers.push(farmerId.toString());

        var socketFarmer = io.of('/' + farmerId.toString());

        socketFarmer.on('connection', function(socket) {
            
            // JOIN ROOM
            socket.on('subscribe', function(room) {
                socket.join(room);
                socketFarmer.in(room).emit('status', { room: room, status: 'connected'});
            });

            // LEAVE ROOM
            socket.on('unsubscribe', function(room) {  
                console.log('leaving room', room);
                socket.leave(room); 
            })

            socket.on('environment', function(msg) {
                console.log('ENV: ');
                console.log(msg);
                socketFarmer.in(msg.room).emit('platform-environment', msg);
            });
            
            socket.on('switch-light', function(msg) {
                socketFarmer.emit('rasp-switch-light', msg);
            });

            socket.on('disconnect', function() {
                socket.disconnect();
                console.log('disconnect');
            });

        });
    }

};
