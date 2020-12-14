const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');
const config = require('./Config/config');
const User = require('./models/users');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const uri = config.mongoConfig.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

let myCurrentUser = {
    loggedIn: false,
    myUser: ""
}

const PORT = process.env.PORT || 3000
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err))


const app = express();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieSession({
    name: '411Proj',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req,res,next) => {
    if(req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/add-user:userName/:password', (req,res) => {

    const user = User ({
        user_name: req.params.userName,
        password: req.params.password
    })
    User.findOne({"user_name": req.params.userName})
    .then(result => {
        if(result) {
            res.json({message: "Already registered"})
            //res.send("Already registered");
          } else {
            user.save()
            .then(result => {
                res.send(result)
            })
          }
    })
})

app.get('/find-user:userName/:password', (req,res) => {
    User.findOne({"user_name": req.params.userName}) 
    .then(result => {
        if(result) {
        if (result.password == req.params.password) {
            myCurrentUser.loggedIn = true;
            myCurrentUser.myUser = req.params.userName;
            res.json({message: "Success"})
        }else {
            res.json({message: "Incorrect login information"})
        } }
        else {
            res.json({message: "Incorrect login information"})
        }
    })
})

app.get('/find-user-by-username:userName', (req,res) => {
    User.findOne({"user_name": req.params.userName}) 
    .then(result => {
        if (result) {
            res.json({message: "Already exists"})
        } else {
            res.json({message: "Success"})
        }
    })
})
app.get('/isLoggedIn', (req,res) => {
    if (myCurrentUser.loggedIn == true) {
        res.json({message: true, myUser: myCurrentUser.myUser})
    } else {
        res.json({message: false, myUser: ""})
    }
})

app.get('/logout:myRedirect', (req,res) => {
    myCurrentUser.loggedIn = false;
    myCurrentUser.myUser = "";
    console.log(req.params)
    if(req.params.myRedirect == "landing") {
        res.redirect('/')
    }else {
        res.redirect(req.params.myRedirect)
    }
})


app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    myCurrentUser.loggedIn = true;
    myCurrentUser.myUser = req.user._json.given_name;
    res.redirect('/');
})
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.displayName}!`))

app.get('/' , (req,res) => {
    res.sendFile(path.join(__dirname, 'public/landingPage.html'))
})

app.get('/searchBathrooms' , (req,res) => {
    res.sendFile(path.join(__dirname, 'public/searchBathrooms.html'))
})
app.get('/login', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'))
})
app.get('/quiz', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/quiz.html'))
})
app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname, 'public/register.html'))
})

app.get('/nearbyBathrooms:currentLat/:currentLon', async (request, response) => {
    var url = 'https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&offset=0&';
    var data = request.params;
    var myReq = url + '&lat=' +  `${data.currentLat}` + '&' + '&lng=' +  `${data.currentLon}`;

    const myrequest = await fetch(myReq);
    const test = await myrequest.json();
    response.send(test);
})

app.get('/specificQueryBathrooms:myQuery', async (request, response) => {
    var url = 'https://www.refugerestrooms.org/api/v1/restrooms/search?page=1&per_page=10&offset=0&ada=false&unisex=false&query=';
    var data = request.params;
    var myReq = url +   `${data.myQuery}`;
    var myReqFin = myReq.replace(/ /g,"%20");
    const myrequest = await fetch(myReqFin);
    const test = await myrequest.json();
    response.send(test);
})

app.get('/getRestaurantQuery:query1/:query2/:query3', (request, response) => {
    let data = request.params;
    let myParam1 = data.query1.replace(/ /g,"%20");
    let myParam2 = data.query2.replace(/ /g,"%20");
    let myParam3 = data.query3.replace(/ /g,"%20");
    let myApiUrl = 'https://us-restaurant-menus.p.rapidapi.com/restaurants/search/fields?fields=' + myParam1 + '%20' + myParam2 + '%20' + myParam3;
    console.log(myApiUrl);
    fetch(myApiUrl, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": config.rapidApiConfig.RAPID_API_KEY,
            "x-rapidapi-host": "documenu.p.rapidapi.com",
            "useQueryString": "true",
            "x-api-key": config.rapidApiConfig.API_KEY
        }
    }).then(res => res.json())
    .then(myText => {
        //console.log(myText);
        response.send(myText);
    })
    
})
module.exports = {myCurrentUser}






