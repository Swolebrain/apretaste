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
app.post("/apretaste-post-page", function(req,res){
  var filename = req.body.fileName;
  var userName = req.body.userName;
  var password = req.body.password;
  var htmlBody = req.body.body;
  fs.readFile("/home/apretaste/"+userName+"/password", function(error, data){
    if (!error){ //folder exists
      if (password != data.toString().trim()){ 
        console.log("Intento de postear con password incorrecto: (username: "+userName+", password: "+password+") - correct pw is "+data);
        res.end("Password incorrecto o alguien con ese nombre de usuario ya existe");
      }
      else{
        console.log("found user and password was correct");
        createPage(filename, userName, htmlBody);
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
        createPage(filename, userName, htmlBody);
      });
    }
  });
  function createPage(filename, userName, htmlBody){
    var fullPath = "/home/apretaste/"+userName+"/"+filename;
    console.log("Creating page in "+fullPath);
    exec("mkdir "+fullPath, function(error, stdout, stderr){
      console.log("Executing mkdir");
      if (!error){
        fs.writeFile(fullPath+"/index.html", htmlBody, function(err){
          if (err){
            console.log("Error writing file named "+fullPath+"/index.html for "+userName);
            res.end("Error escribiendo el archivo de nombre "+filename+" para "+userName);
            return;
          } 
          else{
            res.end("exito");
          }
        });
      }
      else{
        console.log("Error creating folder "+fullPath);
        res.end("error creando el folder para tu pagina");
      }
    });
  }
});




app.listen(port);
console.log("Server listening on port "+port);