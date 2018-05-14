var udp = require('dgram');
var server = udp.createSocket('udp4');

var id = process.argv[2]
var port = process.argv[3]

var os = require( 'os' );

var ip = require('./ip')

var networkInterfaces = os.networkInterfaces( );


server.on('error',function(error){
    console.log('Error: ' + error);
    server.close();
});

server.on('listening',function(){
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port: ' + port);
    console.log('Server ip: ' + ipaddr);

    server.setBroadcast(true)
    server.setMulticastTTL(128); 
    server.addMembership('230.185.192.108', "127.0.0.1");

    console.log( ip.address() );

});


// emits on new datagram msg
server.on('message',function(msg,info){
    console.log('Data received from client : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);

//sending msg
    server.send(msg,info.port,'localhost',function(error){
        if(error){
            client.close();
        }else{
            console.log('Data sent !!!');
        }

    });

});

//emits after the socket is closed using socket.close();
server.on('close',function(){
    console.log('Socket is closed !');
});
    

server.bind(parseInt(port) || 2222);

function callElection(){

    //sending msg
    server.send(msg,info.port,'localhost', function(error){
        
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
