const express = require('express');
const fetch = require('node-fetch');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/getBathrooms' , (req, res) => {
    var url = 'https://www.refugerestrooms.org/api/v1/restrooms/by_location?page=1&per_page=10&offset=0&';
    const data = req.body.lat;
    var myReq = url + '&lat=' +  `${req.body.currentLat}` + '&' + '&lng=' +  `${req.body.currentLon}`;
    console.log(myReq);
    fetch(myReq)
    .then(res => res.text())
    .then(text => console.log(text))
})





