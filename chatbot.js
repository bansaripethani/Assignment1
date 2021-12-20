
const WebSocket = require('ws')
var http = require('http');
var url = require('url');
var st = require('node-static');
var mysql = require('mysql');

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodejs'
});

con.connect(function(err)
        {
            if(err) throw err;
            console.log("connected..");
        
        });
function chatbotReply(msg,callback)
  {
     var sql2="select reply from chatbot_train where keyword LIKE '%"+ msg + "%'";
     con.query(sql2,function(err,result,fields){
     if(err) throw err;
      else if(result.length >  0 )
      {
        callback(null,result[0].reply);
       
      }
      else 
      {
        callback(null,"sorry we don't get you.. please ask another question")  
      }
     });  
  }

var fileServer = new st.Server('./chatbot_index.html');

var httpserver = http.createServer(function(request, response) 
{
	request.on('end', function () {
	var get = url.parse(request.url, true).query;
	fileServer.serve(request, response);
	}).resume();

}).listen(8000, function() {
    console.log((new Date()) + 
      ' Server is listening on port 8000');
});

//WebSocket.Server({server: httpserver})
const wss = new WebSocket.Server({ server: httpserver });

wss.on('connection', function(ws) {
  ws.send('Hello client')

  ws.on('message',function(msg) 
  {
    //ws.send('I received: '+ msg)

    chatbotReply(msg,function(err,data){
      if(err)
       console.log("error: " + err)
       else
       ws.send(" " + data);
    });
  })
})