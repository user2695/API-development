const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", {
    useNewUrlParser: true
});

const articleSchema = {
    title: String,
    content: String

};
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })
    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added new data");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {
        articleSchema.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

app.route("/articles/:articleTitle")
    .get(function (err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles found with that name");
        }
    })
    .put(function (req, res) {
        Article.replaceOne({
                title: req.params.articleTitle
            }, {
                title: req.body.title,
                content: req.body.content
            }, {
                overwrite: true
            },

            function (err) {
                if (!err) {
                    res.send("Successfully updated the article");
                } else {
                    res.send(err);
                }
            }
        )
    })
    .patch(function (req, res) {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            },
            function (err) {
                if (!err) {
                    res.send("Successfully edited document");
                }
            });
    })
    .delete(function (req, res) {
        Article.deleteOne({
                title: req.params.articleTitle
            },
            function (err) {
                if (!err) {
                    res.send("Successfully deleted the document");
                } else {
                    res.send("There was error in deleting the document");
                }
            });
    });

app.listen(3000, function () {
    console.log("Listening on port: 3000");
})