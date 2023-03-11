const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectionString = '';
const auth = require('./src/auth');
const headline = require('./src/Headline');
const article = require('./src/Article');
const profile = require('./src/Profile');
const following = require('./src/Following');
const avatar = require('./src/Avatar');

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const cors = require('cors');
const User = require("./src/userSchema");
const Avatar = require("./src/avatarSchema");
const Headline = require("./src/HeadlineSchema");
const Following = require("./src/followingSchema");
const Profile = require("./src/profileSchema");
const GoogleUser = require("./src/googleUserSchema");

const path = require("path");


const landing = function (req, res) {
    res.status(200).sendFile(path.resolve(__dirname, "build", "index.html"));
    // res.sendFile('./build/index.html', { root: __dirname });
};

const corsOptions = {origin: ['http://localhost:3000', "https://accounts.google.com"], credentials: true};

// const upCloud = require('./src/uploadCloudinary.js');

const app = express();
app.use(express.static(path.join(__dirname, "build")));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));


app.use(session({
    secret: 'doNotGuessTheSecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
            clientID: '',
            clientSecret: '',
            callbackURL: "/auth/google/callback"
        },
        async function (accessToken, refreshToken, profile, done) {
            let user = {
                username: profile.name.givenName + ' ' + profile.name.familyName,
                googleId: profile.id,
                token: accessToken
            };

            let email = profile.emails[0].value;
            let googleUsername = "_google_" + profile.id;

            // console.log(accessToken);
            // console.log("---------------------");
            // console.log(refreshToken);
            // console.log("---------------------");
            // console.log(profile);
            // console.log(profile.photos[0].value)

            // You can perform any necessary actions with your user at this point,
            // e.g. internal verification against a users table,
            // creating new user entries, etc.

            let gUser = await GoogleUser.findOne({googleId: profile.id});


            if (gUser) {
                // console.log(gUser);

            } else {
                let newUser = new GoogleUser(user);
                await newUser.save();
                let avatar = new Avatar({
                    username: googleUsername,
                    avatar: profile.photos[0].value
                });
                await avatar.save();
                let headline = new Headline({username: googleUsername, headline: "Hello, world!"});
                await headline.save();
                let following = new Following({username: googleUsername, following: []});
                await following.save();
                let googleProfile = new Profile({username: googleUsername, email: email, zipcode: "", dob: ""});
                await googleProfile.save();
            }



            return done(null, user);
            // User.findOrCreate(..., function(err, user) {
            //     if (err) { return done(err); }
            //     done(null, user);
            // });
        })
);
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })); // could have a passport auth second arg {scope: 'email'}

// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
// app.get('/auth/google/callback',
//     passport.authenticate('google', { successRedirect: 'http://localhost:3000/main',
//         failureRedirect: '/' }));
app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/' }), function (req, res) {
        // console.log(req.user);
        let googleUsername = "_google_" + req.user.googleId;
        let sid = auth.addCookie(googleUsername);


        res.clearCookie("sid");
        res.clearCookie("username");
        res.clearCookie("userType");
        res.clearCookie("displayName");

        res.cookie("sid", sid, {maxAge: 3600 * 1000, httpOnly: true});
        res.cookie("username", googleUsername, {maxAge: 3600 * 1000, httpOnly: true});
        res.cookie("userType", "google", {maxAge: 3600 * 1000, httpOnly: true});
        res.cookie("displayName", req.user.username, {maxAge: 3600 * 1000, httpOnly: true});
        res.redirect('');//front-end's url
        // res.redirect('http://localhost:3000/main');

    });

const hello = (req, res) => res.send({hello: 'world'});

try {
    mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {


        app.get('/', landing);
        app.get('/main', landing);

        auth.auth(app);
        headline(app);
        article(app);
        profile(app);
        following(app);
        avatar(app);

// Get the port from the environment, i.e., Heroku sets it
        const port = process.env.PORT || 3001;
        const server = app.listen(port, () => {
            const addr = server.address();
            console.log(`Server listening at https://${addr.address}:${addr.port}`)
        });
    })

}catch (e) {

}


