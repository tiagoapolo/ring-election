var udp = require('dgram');
var ip = require('./ip');

var ID = process.pid
var HOST = process.argv[2] || ip.address();
var PORT = process.argv[3] || 2222
var MULTICAST = process.argv[4] || '230.185.192.108'

var lider = null
var node = udp.createSocket('udp4');

console.log('\nCreating...')
console.log('\n--------- NODE INFO -----------')
console.log('ID: ', ID)
console.log('HOST: ', HOST)
console.log('PORT: ', PORT)
console.log('MULTICAST: ', MULTICAST)
console.log('-------------------------------\n')


function callElection(){
    sendMulticast('ELECTION')
}

function respondElection(){

}

function tellNextHop(){

}

function whoIsLeader(){
    if(lider === null)
        callElection()
}

function notifyNodes(){
    if(lider === ID)
        sendMulticast('LIDER:'+ID)
}


function sendMulticast(msg){
    node.send(Buffer.from(msg), PORT, MULTICAST, function(error){
        if(error){
            console.log('Message: '+msg+'\nStatus: '+error);
            client.close();
        }else{
            console.log('Message: '+msg+'\nStatus: SENT');
        }
    });
}

function sendMessageToAddr(msg, host, port){
    node.send(Buffer.from(msg), port, host, function(error){
        if(error){
            console.log('Message: '+msg+'\nStatus: '+error);
            client.close();
        }else{
            console.log('Message: '+msg+'\nStatus: SENT');
        }
    });
}

// emits when any error occurs
node.on('error', function (error) {
    console.log('Error: ' + error);
    node.close();
});

// emits on new datagram msg
node.on('message', function (msg, info) {
    
    console.log('\n-------------------------')
    console.log('Data received : ' + msg.toString());
    console.log('Received from %s:%d\n', info.address, info.port);
    console.log('-------------------------\n')

    let message = msg.toString().toLowerCase()

    if(message === 'election') {
        
    } else if (message === 'lider'){
        lider = message.split(':')[1] || null
    }

});

//emits when socket is ready and listening for datagram msgs
node.on('listening', function () {
    let address = node.address();
    let port = address.port;
    let family = address.family;
    let ipaddr = address.address;    

    node.setBroadcast(true)
    node.setMulticastTTL(128); 
    node.addMembership(MULTICAST, HOST);

    console.log('Node is UP...\n');

});

//emits after the socket is closed using socket.close();
node.on('close', function () {
    console.log('Socket is closed !');
});


setInterval(notifyNodes, 30000)
setInterval(whoIsLeader, 60000)

node.bind(PORT);


