var udp = require('dgram');
var ip = require('./ip');
var buffer = require('buffer');

// creating a client socket
var client = udp.createSocket('udp4');

//buffer msg
var data = Buffer.from('C2');

client.on('message', function (msg, info) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});

client.on('listening', function () {

    var address = client.address();

    client.setBroadcast(true)
    client.setMulticastTTL(128); 
    // client.setMulticastInterface(ip.address())
    client.addMembership('230.185.192.108', ip.address());

    
})


client.bind(4444);

//sending msg
client.send(data, 2222, '230.185.192.108', function (error) {
    if (error) {
        client.close();
    } else {
        console.log('Data sent !!!');
    }
});

// var data1 = Buffer.from('hello');
// var data2 = Buffer.from('world');
