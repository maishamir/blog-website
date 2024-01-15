import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
const port = 3000;

var posts =  {}

//what we will see when we are at the home page
//todo: create the homepage with a creation button and a place to show all the articles
app.get("/", (req, res) => {
    res.render("home.ejs", {blogPosts: posts})
}) 

//what we see when we click on the edit button
//route may be "{name of the post}/edit"
//it might show the form with the current fields

//what we see when we click on create 
//route may be "/create-new"
//creating it takes us to the home page
//todo: create form for creating new posts
app.get("/create-new", (req, res) => {
    res.render("createPost.ejs")
})

//what we see when we create a post and hit submit
//homepage
app.post("/", (req, res) => {
    res.render("home.ejs")
})


//todo: handle post deletion functionality


//since we might truncate long post texts to a certain number of characters, 
//this might be the whole post shown in a new tab
//route may be "/{post title}"
//GET REQUEST








app.listen(port, (req, res) => { 
    console.log(`Listening on port ${port}:`)
})