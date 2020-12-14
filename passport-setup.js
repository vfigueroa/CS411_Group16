const passport = require('passport');
const fetch = require('node-fetch');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./Config/config');
const main = require('./index');
passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((user, done) => {
  done(null, user);
})

passport.use(new GoogleStrategy({
  clientID: config.googleConfig.CLIENT_ID,
  clientSecret: config.googleConfig.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
  // Register user here.
  
  cb(null, profile);
    
  //console.log(accessToken, profile._json.given_name);
  
}
));