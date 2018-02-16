var farmers = [];
var farms = [];

exports.initialize = function(io, farmerId) {

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
                socketFarmer.in(room).emit('status', { room: room, status: 'connected' });
            });

            // LEAVE ROOM
            socket.on('unsubscribe', function(room) {  
                console.log('leaving room', room);
                socket.leave(room); 
            })

            socket.on('environment', function(data) {
                socketFarmer.in(data.room).emit('platform-environment', data);
            });
            
            socket.on('switch-light', function(data) {
                socketFarmer.in(data.room).emit('rasp-switch-light', data);
            });

            socket.on('disconnect', function() {
                socket.disconnect();
                console.log('disconnect');
            });

        });
    }

};
