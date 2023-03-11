const md5 = require('md5');
const User = require('./userSchema');
const Headline = require('./HeadlineSchema');
const Following = require('./followingSchema');
const Profile = require('./profileSchema');
const Avatar = require('./avatarSchema');


let sessionUser = {};
let sessionNumber=0;
let cookieKey = "sid";

let userObjs = {};

function addCookie(username) {
    let sid = sessionNumber;
    sessionUser[sessionNumber++] = username;

    return sid;
}

function init(req, res) {
    if (req.session) {
        let googleUsername = "_google_" + req.session.passport.user.googleId
        let sid = addCookie(googleUsername);


        res.cookie("sid", sid, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true});
        res.cookie("username", googleUsername, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true});
        res.cookie("userType", "google", {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true});
        res.cookie("displayName", req.user.username, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'None', secure: true});
    }

    res.send("ok");
}

function isLoggedIn(req, res, next) {
    // console.log('is login')
    // console.log(req.cookies);
    // console.log(req.session);
    if (!req.cookies) {
        // console.log('no cookies');
       return res.sendStatus(401);
    }

    // console.log(req.cookies);
    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        // if(){
        //
        // }else{
        //     return res.sendStatus(401);
        // }

        return res.sendStatus(401);

    }

    let username = sessionUser[sid];

    // no username mapped to sid
    if (username) {

        req.username = username;
        next();
    }
    else {
        return res.sendStatus(401)
    }
}

async function login(req, res) {

    if (req.cookies) {
        let sid = req.cookies[cookieKey];

        if (sessionUser[sid]) {
            return res.sendStatus(401);

        }
    }



    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    const user = await User.findOne({username: username});

    if (!user) {
        return res.sendStatus(401)
    }

    // TODO: create hash using md5, user salt and request password, check if hash matches user hash
    let hash = md5(user.salt + password);

    if (hash === user.hash) {
        // TODO: create session id, use sessionUser to map sid to user username 
        let sid = sessionNumber; // CHANGE THIS!
        sessionUser[sessionNumber++] = username;

        // Adding cookie for session id
        res.cookie(cookieKey, sid, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
        res.cookie("username", username, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
        res.cookie("userType", "local", {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
        let msg = {username: username, result: 'success'};
        res.send(msg);
    } else {
        res.sendStatus(401);
    }
}

function logout(req, res) {

    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    let username = sessionUser[sid];

    // no username mapped to sid
    if (username) {
        delete sessionUser[sid];
        res.clearCookie("sid");
        res.clearCookie("username");
        res.clearCookie("userType");
        res.clearCookie("displayName");
        return res.sendStatus(200);
    }
    else {
        return res.sendStatus(401)
    }

}

async function register(req, res) {

    if (req.cookies) {
        let sid = req.cookies[cookieKey];

        if (sid) {
            return res.sendStatus(401);

        }
    }

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let zipcode = req.body.zipcode;
    let birthday = req.body.dob;


    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    let isUsernameRegistered = await User.findOne({username: username});
    if (isUsernameRegistered) {
        return res.send({result: 'registered'});
    }

    let salt = username + new Date().getTime();
    let hash = md5(salt + password); // TODO: Change this to use md5 to create a hash

    let newUser = new User({username: username, salt: salt, hash: hash});
    await newUser.save();
    let avatar = new Avatar({username: username,
        avatar: "https://res.cloudinary.com/hw8vifm2n/image/upload/v1670018006/blank-profile-picture_isujen.webp"});
    await avatar.save();
    let headline = new Headline({username: username, headline: "Hello, world!"});
    await headline.save();
    let following = new Following({username: username, following: []});
    await following.save();
    let profile = new Profile({username: username, email: email, zipcode: zipcode, dob: Date.parse(birthday)});
    await profile.save();

    // userObjs[username] = {salt: salt, username: username, hash: hash}; // TODO: Change this to store object with username, salt, hash

    let msg = {user: newUser, result: 'success'};
    res.send(msg);
}


exports.auth = (app) => {
    app.get('/init', init);
    app.post('/login', login);
    app.post('/register', register);
    app.put('/logout', logout);
    app.use(isLoggedIn);
}
exports.addCookie = addCookie;

// module.exports = () => {
//     this.auth=function (app) {
//         app.post('/login', login);
//         app.post('/register', register);
//         app.put('/logout', logout);
//         app.use(isLoggedIn);
//     }
//     this.addCookie = addCookie;
//
// }

