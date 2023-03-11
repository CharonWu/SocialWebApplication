const Profile = require('./profileSchema');
const User = require('./userSchema')
const md5 = require("md5");
const Article = require("./articleSchema");
const Following = require("./followingSchema");

async function getEmail(req, res) {
    let username = req.params.user;
    if (!username) {
        username = req.cookies['username'];
    }
    const profile = await Profile.findOne({username: username});
    if (!profile) {
        return res.sendStatus(404);
    }

    if (req.cookies['userType'] === "google") {
        username = req.cookies['displayName'];
    }

    res.send({username: username, email: profile.email, result: "success"});
}

async function updateEmail(req, res) {
    let username = req.cookies['username'];
    let newEmail = req.body.email;
    const profile = await Profile.findOne({username: username});
    if (!profile) {
        return res.sendStatus(404);
    }
    profile.email = newEmail;
    await profile.save();
    res.send({username: username, email: profile.email, result: "success"});
}

async function getZipcode(req, res) {
    let username = req.params.user;
    if (!username) {
        username = req.cookies['username'];
    }
    const profile = await Profile.findOne({username: username});
    if (!profile) {
        return res.sendStatus(404);
    }
    res.send({username: username, zipcode: profile.zipcode, result: "success"});
}

async function updateZipcode(req, res) {
    let username = req.cookies['username'];
    let newZipcode = req.body.zipcode;
    const profile = await Profile.findOne({username: username});
    if (!profile) {
        return res.sendStatus(404);
    }
    profile.zipcode = newZipcode;
    await profile.save();
    res.send({username: username, zipcode: profile.zipcode, result: "success"});
}

async function updatePassword(req, res) {
    if (req.cookies["userType"] === "google") {
        return res.sendStatus(401);
    }
    let username = req.cookies['username'];
    let password = req.body.password;

    let salt = username + new Date().getTime();
    let hash = md5(salt + password);

    let user = await User.findOne({username: username});
    if (!user) {
        return res.sendStatus(404);
    }
    user.salt = salt;
    user.hash = hash;
    await user.save();

    res.send({username: username, result: 'success'});

}

async function getBirthday(req, res) {
    let username = req.params.user;
    if (!username) {
        username = req.cookies['username'];
    }
    const profile = await Profile.findOne({username: username});
    if (!profile) {
        return res.sendStatus(404);
    }

    res.send({username: username, dob: profile.dob});

}

async function getUserType(req, res) {
    if (req.cookies['userType']) {
        return res.send({type: req.cookies['userType']});
    }

    return res.sendStatus(404);
}

async function linkUser(req, res) {

    try{
        let username = req.cookies['username'];

        let type = req.cookies['userType'];
        let linkuser = req.body.linkUsername;
        let linkpass = req.body.linkPassword;

        const user = await User.findOne({username: linkuser});

        if (!linkuser) {
            return res.sendStatus(401)
        }

        // TODO: create hash using md5, user salt and request password, check if hash matches user hash
        let hash = md5(user.salt + linkpass);


        if (hash === user.hash) {

            await Article.updateMany({author:username}, {$set: {author : linkuser}});



            let googlefollow = await Following.findOne({username: username});
            let localfollow = await Following.findOne({username: linkuser});


            googlefollow.following.map(fu=>{
                if (localfollow.following.indexOf(fu) == -1) {
                    localfollow.following.push(fu);
                }
            })
            localfollow.markModified('following');

            await  localfollow.save();


            res.cookie("username", linkuser, {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
            res.cookie("userType", "local", {maxAge: 3600 * 1000, httpOnly: true, sameSite: 'none', secure: true});
            return res.sendStatus(200);
        }

        return res.sendStatus(404);

    }catch (e) {

        return res.sendStatus(404);
    }


}


module.exports = (app) => {
    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);
    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);
    app.put('/password', updatePassword);
    app.get('/dob/:user?', getBirthday);
    app.get('/userType', getUserType);
    app.post('/link', linkUser);
}