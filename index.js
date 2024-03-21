import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { decode } from "querystring";
import methodOverride from "method-override";

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method')); 
const port = 3000;

var posts = {
    '01': { title: 'Sample Blog Title', content: "Interloper overhaul scuttle provost coffer lateen sail black spot snow skysail Buccaneer. Jib weigh anchor Davy Jones' Locker smartly run a rig chase guns yard long clothes Spanish Main Sail ho. Lass ho ye gangway chandler hulk execution dock Plate Fleet Brethren of the Coast doubloon." }
}

//what we will see when we are at the home page
//todo: create the homepage with a creation button and a place to show all the articles
app.get("/", (req, res) => {
    res.render("home.ejs", {blogPosts: posts})
}) 

//what we see when we click on the edit button
//route may be "{name of the post}/edit"
//it might show the form with the current fields
app.get("/posts/:title/edit", (req, res) => {
    const postTitle = req.params.title;
    //returns the kebab-casing version of the title
    const desiredTitle = postTitle.replaceAll("-", " ")
    //find the post with the desired title in the posts array

    for (const postId in posts) {
        if ((posts[postId].title).toLowerCase() == desiredTitle) {
            //render the edit post form with all the values inside
            let editTitle = posts[postId].title;
            let editContent = posts[postId].content;
            res.render('editPost.ejs', {title: editTitle, content: editContent})
        }
    }
})

//what we see when we submit our edits
//when we hit submit, it posts to "posts/update/:title" and renders the homepage
app.post("/posts/:title", (req, res) => {
    const postTitle = req.params.title;
    let desiredTitle = decodeURIComponent(postTitle)

    desiredTitle = desiredTitle.replaceAll("-", " ");

    const updatedTitle = req.body.postTitle;
    const updatedContent = req.body.postContent;

    //get the post with the desired title
    for (const postId in posts) {
        if ((posts[postId].title).toLowerCase() == desiredTitle.toLowerCase()) {
            posts[postId].title = updatedTitle;
            posts[postId].content = updatedContent;

            res.redirect("/")
            return;
        }
    }

    res.redirect("/")
})

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

    //get the title and the post content 
    let postTitle = req.body.postTitle;
    let postContent = req.body.postContent;
    let postID = uuidv4();

    //store it in an object and display it on the homepage
    posts[postID] = { title: postTitle, content: postContent }

    //make a new request to the home route; makes sure that the previous form data is not being re-submitted
    res.redirect("/")
})

app.get('/posts/:title', (req, res) => {
    const postTitle = req.params.title;
    const decodedTitle = decodeURIComponent(postTitle);

    for (const postId in posts) {
        if ((posts[postId].title).toLowerCase() === decodedTitle.toLowerCase()) {
            res.render("post.ejs", { title: posts[postId].title, content: posts[postId].content })
            return;
        }
    }

    //if post is not found
    res.redirect("/");
})

//todo: handle post deletion functionality
app.post("/delete", (req, res) => {
    
    let postFound = false;
    const titleToDelete = req.body.title;

    for (const postId in posts) {
        if (posts[postId].title === titleToDelete) {
            delete posts[postId];
            postFound = true;
            res.redirect("/");
            return;
        }
    }

    if (!postFound) {
        res.status(404).send("Post not found")
    }
})

//since we might truncate long post texts to a certain number of characters, 
//this might be the whole post shown in a new tab
//route may be "/{post title}"

app.listen(port, (req, res) => { 
    console.log(`Listening on port ${port}:`)
})