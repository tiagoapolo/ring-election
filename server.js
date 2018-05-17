var udp = require('dgram');
var ip = require('./ip');
// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error', function (error) {
    console.log('Error: ' + error);
    server.close();
});

// emits on new datagram msg
server.on('message', function (msg, info) {
    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);

    //sending msg
    // server.send(Buffer.from('Received'), info.port, '230.185.192.108', function (error) {
    //     if (error) {
    //         client.close();
    //     } else {
    //         console.log('Data sent !!!');
    //     }

    // });

});

//emits when socket is ready and listening for datagram msgs
server.on('listening', function () {
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);

    server.setBroadcast(true)
    server.setMulticastTTL(128); 
    // server.setMulticastInterface(ip.address())
    server.addMembership('230.185.192.108',ip.address());

});

//emits after the socket is closed using socket.close();
server.on('close', function () {
    console.log('Socket is closed !');
});

server.bind(2222);


function callElection(){

    //sending msg
    server.send(Buffer.from('hello'), 2222, '192.168.56.1', function(error){
        
        if(error){
            client.close();
        }else{
            console.log('Data sent !!!');
        }

    });

}

function tellEveryone(){

}

function respondElection(){

}

function tellNextHop(){

}
