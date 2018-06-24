var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(express.static('public')) // Public is the folder which has all the html, css and js files
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/jobdbb"); // jobdbb is the database
var db = mongoose.connection;

db.on('error', function(){
    console.log('connection failed');
});

db.on('open', function(){
    console.log("connection is established");
});

// Creating a schema

var J_Schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
        required: true
    }
});

var user = mongoose.model('users', J_Schema); //users is the collection where you have all the user details

app.get('/', function(request, response){
    response.sendFile(__dirname + 'public/index.html');
});

app.listen(8003, function(){
    console.log('Middleware/Express/Node/Backend is running on the localhost:8003');
});

app.post("/createuser", function(request, response){
    var user1 = new user(request.body);
    user1.save();
})


app.post("/login", function(request, response){
    // console.log(request.body);
    user.findOne({ username: request.body.username}, function(err, docs){
        // console.log(docs);
    
    if(!docs){
        response.json({
            success: false,
            user: null
        })}
    else{
        if(docs.password == request.body.password){
            user.findOneAndUpdate({username: request.body.username},{$set:{'isLoggedIn': true}}, function(err, data){
                if(!err){
                    response.json({
                        success: true,
                        user: data // isLoggedIn: true
                    });
                }
            });
        } else{
            response.json({
                success: false,
                user: null // isLoggedIn: false
            });
        }

    }
    


    });
});

app.post('/getUser', function(request, resolve){
    console.log(request.body);

    user.findOne({"isLoggedIn": true}, function(err, docs){
        console.log(docs);
    if(!err){
        resolve.send({'flag': 'success', 'data': docs});
    }
    else{
        resolve.send({'flag':'fail','data':'error'})
    }

    });

});

app.put('/logout', function(request, resolve){
    console.log("Body:", request.body);
    user.findOneAndUpdate({username: request.body.username}, {'isLoggedin':false}, function(err, docs){
        if(!err){
            resolve.send({'flag':'success', 'data':docs});
        }else{
            resolve.send({"flag":"fail",'data':err})
        }
    });
});