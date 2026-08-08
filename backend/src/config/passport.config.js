import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import config from "./config.js";



passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
     
      const userData = {
        id: profile.id,
        displayName: profile.displayName,
        name: profile.name,
        emails: profile.emails,
        photos: profile.photos,
      };
   console.log("userdata is " , userData)
      return done(null, userData);
    }
  )
);


passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL,
       profileFields: ['id', 'displayName', 'name', 'emails', 'photos']
     
    },
    (accessToken, refreshToken, profile, done) => {

      
      const userData = {
        id: profile.id,
        displayName: profile.displayName,
        name: profile.name,
        emails: profile.emails,
        photos: profile.photos,
      };

      return done(null, userData);

    }
  )
);

export default passport

