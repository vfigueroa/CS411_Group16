const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const https = require('https');
const { resolveSoa } = require('dns');
const PORT = process.env.PORT || 3000

const app = express();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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
            "x-rapidapi-key": "79ebc88929msh08237d672f2e1b3p19ee6bjsn0a2f8d83cd78",
            "x-rapidapi-host": "documenu.p.rapidapi.com",
            "useQueryString": "true",
            "x-api-key": "6e26df34a11f99b8bdd8de35eca6f88c"
        }
    }).then(res => res.json())
    .then(myText => {
        //console.log(myText);
        response.send(myText);
    })
    
})






