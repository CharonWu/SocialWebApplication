const Article = require('./articleSchema');
const Avatar = require("./avatarSchema");
const uploadImage = require("./uploadCloudinary");
const Following = require("./followingSchema");

async function getArticle(req, res) {

    let id = req.params.id;
    if (id) {
        let data = await Article.find({pid: id});
        res.send({articles: data, result: "success"});
        return;
    }

    let data = await Article.find({author: req.cookies["username"]});
    if (!data) {
        res.sendStatus(404);
        return;
    }

    if (req.cookies["userType"] === "google") {
        data = data.map(post=>{
            if (post.author === req.cookies["username"]) {
                post.author = req.cookies["displayName"];
            }

            return post;
        });
    }

    res.send({articles: data, result: "success"});

}

async function getFeed(req, res) {
    try {
        let following = await Following.findOne({username: req.cookies["username"]});
        let users = following.following;

        users.push(req.cookies["username"]);

        let data = await Article.find({author: {$in: users}});


        data.sort(function (a,b) {
            return new Date(b.date) - new Date(a.date);
        })

        if (req.cookies["userType"] === "google") {
            data = data.map(post=>{
                if (post.author === req.cookies["username"]) {
                    post.author = req.cookies["displayName"];
                }

                return post;
            });
        }



        res.send({articles: data, result: "success"});
    } catch (e) {
        res.sendStatus(404);
    }


}

async function updateArticle(req, res) {
    let id = req.params.id;
    let type = req.body.type;
    let text = req.body.text;
    let username = req.cookies['username'];

    let article = await Article.findOne({pid: id});
    if (!article) {
        res.sendStatus(404);
        return;
    }

    if (type === "comment") {
        let commentId = req.body.commentId;
        let comments = article.comments;
        let commentAuthor = req.cookies["userType"]==="google"?req.cookies["displayName"]:username;

        if (commentId === -1) {
            comments.push({author: commentAuthor, comment: text, commentId: comments.length + 1});
        } else {
            let index = comments.findIndex((c) => c.commentId === commentId);
            if (index<0) {
                res.sendStatus(404);
                return;
            }
            if (comments[index].author === commentAuthor) {
                comments[index].comment = text;
            } else {
                res.sendStatus(401);
                return;
            }
        }

        article.comments = comments;
        article.markModified('comments');

    } else {
        if (article.author !== username) {
            res.sendStatus(401);
            return;
        }
        article.text = text;
    }

    await article.save();


    if (req.cookies["userType"] === "google") {
        article.author = req.cookies["displayName"];
    }
    res.send({article: article, result: "success"});

}

async function addArticle(req, res) {
    let username = req.cookies['username'];
    let text = req.body.text;
    let comments = [];
    let id = await Article.count() + 1;

    let imageUrl="";

    if (req.body.image) {
        imageUrl = req.body.image;
    }


    let article = new Article({
        author: username,
        pid: id,
        text: text,
        comments: comments,
        image: imageUrl,
        date: Date.now()
    });
    await article.save();

    const articles = await Article.find({author: username});

    if (req.cookies["userType"] === "google") {
        article.author = req.cookies["displayName"];
    }

    res.send({articles: article, result: "success"});

}

async function uploadPostImage(req, res) {

    let username = req.cookies['username'];

    res.send({image: req.fileurl, username: username});

}

module.exports = (app) => {
    app.get('/feed', getFeed);
    app.get('/articles/:id?', getArticle);
    app.put('/articles/:id', updateArticle);
    app.post('/article', addArticle);
    app.put('/image', uploadImage('avatar'), uploadPostImage);
}