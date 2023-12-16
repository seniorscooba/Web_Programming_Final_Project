//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import * as posts from '../data//posts.js';
import validation from '../validation.js';

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    if(req.session.user){
      const postList = await posts.getAllPosts();
      res.render('posts', { title:'Posts', 
                            loggedIn:true,
                            posts:postList});
    }
      else
        res.render('posts', { title:'Posts', loggedIn:false });
  } catch (e) {
    res.status(500).json({error: e});
  }
});


router.route('/').post(async (req, res) => {
  //code here for POST this is where your form will be submitting searchCharacterByName and then call your data function passing in the searchCharacterByName and then rendering the search results of up to 15 characters.
// noticed searchCharacterByName in body, need to extract
const POST_TITLE_KEY = "postTitleInput";
const POST_CONTENT_KEY = "postContentInput";
try {
  if(POST_TITLE_KEY in req.body && POST_CONTENT_KEY in req.body)
  {
    let postTitle = req.body[POST_TITLE_KEY];
    let postContent = req.body[POST_CONTENT_KEY];
    let userId = req.session.user.userId;
    let userName = req.session.user.emailAddress;

    // check if 400 error
    postTitle = postTitle.trim();
    postContent = postContent.trim();
    if(postTitle == '' || postContent == '' || userId == undefined || userId == ''){
      res.status(400);
      res.render('error', {hasErrors: true,
        error: '400 Error: Enter search name',
        title:'Posts'});
    }

    const postId = await posts.createPost(userId, userName, postContent, null);
    // make query to API
    res.status(200);
    const postList = await posts.getAllPosts();
    if(postId)
      res.render('posts', { title:'Posts',
                            loggedIn:true,
                            posts:postList});
    else
      res.render('error', {hasErrors: true,
        error: `We're sorry, but we could not post your content`,
        title:'Could not post'});
  }
} catch (e) {
  console.log(e);
}
});

//export router
export default router;
