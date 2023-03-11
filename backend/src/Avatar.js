const uploadImage = require("./uploadCloudinary");
const Avatar = require("./avatarSchema");

async function getAvatar(req, res) {
    try {
        let username = req.params.user;
        if (!username) {
            username = req.cookies['username'];
        }

        let avatar = await Avatar.findOne({username: username});
        res.send({avatar: avatar.avatar, username: username});
    } catch (e) {
        res.sendStatus(404);
    }



}

async function uploadAvatar(req, res) {

    let username = req.cookies['username'];

    console.log();
    let avatar = await Avatar.findOne({username: username});
    avatar.avatar=req.fileurl;
    await avatar.save();

    res.send({avatar: req.fileurl, username: username});

}


module.exports = (app) => {
    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', uploadImage('avatar'), uploadAvatar)

}