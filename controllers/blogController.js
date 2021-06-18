const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

// Blogs GET Handler

exports.blog_index = (req, res) => {

    Blog.find().sort({createdAt: -1})
    .then((blogs) => res.render('blogs/blogs', {title: 'Home', blogs: blogs}))
    .catch((err) => console.log(err));
};

// Blog Details Handler

exports.blog_details = (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
    .then(blog => res.render('blogs/detail', {title: 'Blog Details' , blog: blog}))
    .catch(err => res.status(400).redirect('/'));
};

// Blog Create GET Handler

exports.blog_create_get = (req, res) => {
    res.render('blogs/create', {title: 'Create Blog'});
};

// Blog Create POST Handler

exports.blog_create_post = async (req, res) => {

    const {title, snippet, content} = req.body;
    const id = await jwt.verify(req.cookies.jwt, '*6t|xy-a#s$r`g1/q=_u').id;
    const user = await User.findById(decodedToken);

    Blog.create({title, snippet, content, author: user.username, authorId: user.id})
    .then(blog => res.redirect('/blogs'))
    .catch(err => res.status(403).redirect('/blogs/create'));
};

// Blog Edit GET Handler

exports.blog_edit_get = async (req, res) => {

    const id = req.params.id;
    const decodedToken = await jwt.verify(req.cookies.jwt, '*6t|xy-a#s$r`g1/q=_u');

    const blog = await Blog.findById(id);
    
    if (blog.authorId.toString() === decodedToken.id) res.render('blogs/edit', {title: 'Edit-Blog', blog: blog});
    res.status(403).redirect('/blogs');
};

// Blog Edit POST Handler

exports.blog_edit_post = async (req, res) => {

    const id = req.params.id;
    const {title, snippet, content} = req.body;

    const decodedToken = await jwt.verify(req.cookies.jwt, '*6t|xy-a#s$r`g1/q=_u');
    const user = await User.findById(decodedToken.id);

    Blog.findOneAndUpdate(id, {
            title, snippet, content,
            author: user.username}, {new: true})
    .then(blog => res.redirect(`/blogs/${blog._id}`))
    .catch(err => res.status(400).redirect('/blogs'));
};

// Blog DELETE Handler

exports.blog_delete = async (req, res) => {

    const id = req.params.id;
  
    Blog.findOneAndDelete(id)
    .then(blog => res.json({redirect: '/blogs'}))
    .catch(err => res.status(403).redirect('/blogs'));
};