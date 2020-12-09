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




app.get('/nearbyBathrooms:currentLat/:currentLon', async (request, response) => {
    var url = 'https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&offset=0&';
    var data = request.params;
    var myReq = url + '&lat=' +  `${data.currentLat}` + '&' + '&lng=' +  `${data.currentLon}`;

    const myrequest = await fetch(myReq);
    const test = await myrequest.json();
    response.send(test);
})

app.get('/specificQueryBathrooms/:myQuery', async (request, response) => {
    var url = 'https://www.refugerestrooms.org/api/v1/restrooms/search?page=1&per_page=10&offset=0&ada=false&unisex=false&query=';
    var data = request.params;
    var myReq = url +   `${data.myQuery}`;

    const myrequest = await fetch(myReq);
    const test = await myrequest.json();
    response.send(test);
})






