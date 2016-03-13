var port = 9000;
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var util = require("util");
var exec = require("child_process").exec;

app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", function(req,res){
  res.end("It's working");
});


/* POST VARIABLES:
  fileName 
  userName
  password
  body
*/
app.post("apretaste-post-page", function(req,res){
  var filename = req.body.fileName;
  var userName = req.body.userName;
  var password = req.body.password;
  var htmlBody = req.body.body;
  fs.readFile("/home/apretaste/"+userName+"/password", function(error, data){
    if (!err){ //folder exists
      if (password != data){ 
        console.log("Intento de postear con password incorrecto: (username: ${userName}, password: ${password})");
        res.end("Password incorrecto o alguien con ese nombre de usuario ya existe");
      }
      else{
        
      }
    }
    else{ //folder doesn't exist
      exec("apretasteNewSite "+userName+" "+password, function(error, stdout, stderr){
        console.log("stdout: "+stdout);
        console.log("stderr: "+stderr);
        if (error){ 
          console.log("exec error: "+error);
          res.end("Error escribiendo su sitio: "+error);
          return;
        }
        createPage(filename, userName, htmlBody, res);
      });
    }
  });
});


function createPage(filename, userName, htmlBody, res){
  fs.writeFile("/home/apretaste/"+username+"/"+filename+"/index.html", htmlBody, function(err){
    if (err){
      console.log("Error writing file named ${filename} for ${userName}");
      res.end("Error escribiendo el archivo de nombre ${filename} for ${userName}");
      return;
    } 
    else{
      res.end("exito");
    }
  });
}

app.listen(port);
console.log("Server listening on port "+port);