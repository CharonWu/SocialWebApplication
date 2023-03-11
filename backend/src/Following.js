const Following = require('./followingSchema');
const User = require('./userSchema');

async function getFollowing(req, res) {
    let username = req.params.user;
    if (!username) {
        username = req.cookies["username"];
    }
    let following = await Following.findOne({username: username});

    if (!following) {
        return res.sendStatus(404);
    }
    res.send({username: username, following: following, result: "success"});


}

async function addFollowing(req, res) {

    const user = req.params.user;

    const username = req.cookies['username'];

    if (user === username) {
        res.sendStatus(401);
        return;
    }

    let userData = await User.findOne({username: user});
    if (!userData) {
        res.sendStatus(404);
        return;
    }

    let following = await Following.findOne({username: username});
    if (following == null) {
        res.sendStatus(401);
        return;
    }
    if (following.following.includes(user)) {
        res.sendStatus(401);
        return;
    }
    following.following.push(user);
    following.markModified('following');
    await following.save();
    res.send({username: username, following: following, result: "success"});

}

async function deleteFollowing(req, res) {
    const user = req.params.user;
    const username = req.cookies['username'];

    let following = await Following.findOne({username: username});
    if (!following) {
        return res.sendStatus(404);
    }
    following.following.remove(user);
    following.markModified('following');
    await following.save();
    res.send({username: username, following: following, result: "success"});

}

module.exports = (app) => {
    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', addFollowing);
    app.delete('/following/:user', deleteFollowing)
}
