var udp = require('dgram');
var ip = require('./ip');
var fs = require('fs');

var ID = process.pid
var HOST = process.argv[2] || ip.address();
var PORT = process.argv[3] || 2222
var MULTICAST = '224.0.0.1'
var GROUP_PORT = '43567'
var type = process.argv[4] || 'nl'
var isLeaderOn = false;

if(type === 'cl') // clean file
{
    fs.truncate('ips.txt',0,function(){console.log('done')});
}

var lider     = null
var liderHost = null
var liderPort = null

var node = udp.createSocket({ type: "udp4", reuseAddr: true });

node.bind(PORT);

writeNode(ID,HOST,PORT);

console.log('\nCreating...')
console.log('\n--------- NODE INFO -----------')
console.log('ID: ', ID)
console.log('HOST: ', HOST)
console.log('PORT: ', PORT)
console.log('MULTICAST: ', MULTICAST)
console.log('-------------------------------\n')


function callElection(){
    let addresses = readNode();

    for(let i = 0;  i< addresses.length; i++)
    {
        let socket = udp.createSocket('udp4');
        let info = addresses[i].split(",");
        
        if(info[0] > ID)
        {
            socket.send('election',info[2],info[1],function(error){
                if(error)
                {
                    console.log("Erro ao enviar eleicao " + error);
                }
                else
                {
                    console.log("Eleicao enviada a %s:%s",info[1],info[2]);
                }
            });
            return;
        }
    }

    lider = ID;
}

function respondElection(){

}

function tellNextHop(){

}

function whoIsLeader(){
    console.log("Vish:", lider,ID);
    if(lider === ID)
    {
        return;
    }

    if(lider === null)
        callElection()
    else
    {
        // testa lider
        isLeaderOn = false;
        lider = null;
        console.log(liderHost,liderPort);
        sendMessageToAddr('alive',liderHost,liderPort);
        setTimeout(function(){
            if( ! isLeaderOn)
            {
                callElection();
            }
        },2000);

    }
}

function notifyNodes(){
    if(lider === ID)
    {
        let addresses = readNode();

        for(let i = 0;  i< addresses.length; i++)
        {
            let socket = udp.createSocket('udp4');
            let info = addresses[i].split(",");
            
            if(info.length < 3)
            {
                continue;
            }

            socket.send('LIDER:'+ID+","+HOST+","+PORT,info[2],info[1],function(error){
                if(error)
                {
                    console.log("Erro ao dizer que sou o lider " + error);
                }
                else
                {
                    console.log("Avisei todo mundo que eu que mando na porra toda");
                }
            });

        }   
    }
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

    let message = msg.toString().toLowerCase().split(":");
    console.log("Message:" + message);
    if (message[0] === 'lider')
    {
        let info = message[1].split(",");

        lider = info[0];
        liderHost = info[1];
        liderPort = info[2];
        
        console.log('Quem manda nisso tudo aqui e o ' + lider);
    }
    else if(message[0] === 'alive')
    {
        sendMessageToAddr('YEP',info.address,info.port);
    }
    else if(message[0] === "YEP")
    {
        isLeaderOn = true;
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

function readNode()
{
    let file = fs.readFileSync('ips.txt','utf8');
    addresses = file.split(";");

    let address = addresses.map((item) => {
        let b = item.replace(/\n/g,'');
        b = b.replace(/\r/g,'');
        return b;
    })
    
    return address;
}

function writeNode(pid,address,port)
{
    fs.appendFileSync('ips.txt',pid+','+address+','+port+';');
}


setInterval(notifyNodes, 10000)
setInterval(whoIsLeader, 10000)