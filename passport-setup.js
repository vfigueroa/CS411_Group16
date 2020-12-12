const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./Config/config');
passport.authenticate('google', {scope: '/login'});

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: config.googleConfig.CLIENT_ID,
    clientSecret: config.googleConfig.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));
