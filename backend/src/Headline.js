const Headline = require('./HeadlineSchema');


async function getHeadline(req, res) {

    let username = req.params.user;
    if (!username) {
        username = req.cookies['username'];
    }
    let headline = await Headline.findOne({username: username});
    if (!headline) {
        return res.sendStatus(404);
    }

    if (req.cookies['userType'] === "google") {
        username = req.cookies['displayName'];
    }

    res.send({headline:headline.headline, username: username});

}

async function updateHeadline(req, res) {

    const username = req.cookies['username'];
    const headline = req.body.headline;

    let data = await Headline.findOne({username: username});
    if (!data) {
        return res.sendStatus(404);
    }

    data.headline = headline;

    await data.save();
    res.send({username: username, headline: data.headline});

}


module.exports = (app) => {
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', updateHeadline);
}