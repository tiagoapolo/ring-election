var PORT = process.argv[3] || 2222
var HOST = require('./ip').address()
var dgram = require('dgram');
var client = dgram.createSocket('udp4');

client.on('listening', function () {
    var address = client.address();
    console.log('UDP Client listening on ' + address.address + ":" + address.port);
    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    client.addMembership('230.185.192.108', HOST);

    // client.send(Buffer.from('hello'),PORT,'230.185.192.108', function(error){
        
    //     if(error){
    //         client.close();
    //     }else{
    //         console.log('Data sent !!!');
    //     }

    // });

});

client.on('message', function (message, remote) {   
    console.log('A: Epic Command Received. Preparing Relay.');
    console.log('B: From: ' + remote.address + ':' + remote.port +' - ' + message);
});

client.bind(PORT);