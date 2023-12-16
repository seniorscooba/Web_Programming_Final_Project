//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import { Router } from 'express';
const router = Router();
import validation from '../validation.js';
import { createPost } from '../data/posts.js';

router
  .route('/')
  .get(async (req, res) => {
    try {
      if (req.session.user)
        res.render('posts', { title: 'Posts', loggedIn: true });
      else
        res.render('posts', { title: 'Posts', loggedIn: false });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    try {
      console.log("made it to post")
      let postTitle = validation.checkString(req.body['postTitleInput'], 'Post title');
      let postContent = validation.checkString(req.body['postContentInput'], 'Post content');
      let user = req.session.user;
      // TODO: replace first + last with username
      // I did this because I am wokring in the "postsbranch"
      // And I dont want to adjust user function just yet
      let createStatus = await createPost(user._id, user.firstName + user.lastName, postTitle, postContent);
      if (!createStatus.insertedUser) {
        throw "Failed to insert user!";
      }
      res.status(200).redirect('/posts');
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  export default router;
