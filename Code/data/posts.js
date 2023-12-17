import validation from '../validation.js';
import { posts } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const createPost = async (
    userId,
    userName,
    postTitle,
    postContent,
) => {
    try {
        // validate post creation information

        // assumes userName correct
        validation.checkId(userId)
        validation.checkString(postTitle, "Post title");
        validation.checkString(postContent, "Post content");

        // create post
        const newPost = {
            userId: userId,
            userName: userName,
            postTitle: postTitle,
            postContent: postContent,
            postDate: new Date().toUTCString(),
            postUpvotes: [],
            postComments: [],
        };
        // insert post into database
        const postsCollection = await posts();
        const insertionStatus = await postsCollection.insertOne(newPost);
        if (!insertionStatus.insertedId) throw "Insert failed!";
        console.log(insertionStatus);
        return await get(insertionStatus.insertedId.toString());
    } catch (e) {
        throw e;
    }
};

export const createPostComment = async (postId, userId, comment) => {
    postId = validation.checkId(postId, "Post Id");
    comment = validation.checkString(comment, "Comment");
    userId = validation.checkId(userId, "User id");
      
    const postForComment = await get(postId);
  
    if(postForComment)
    {
      let newCommentId = new ObjectId();
      const newComment = {
        _id: newCommentId,
        content: comment,
        userId: userId,
        createDate: new Date()
      };
      
      postForComment.postComments.push(newComment);
      const postCollection = await posts();
      const newInsertInformation = await postCollection.findOneAndUpdate(
        {_id: new ObjectId(postId)},
        {$set: postForComment},
        {returnDocument: 'after'}
      );
      return postForComment;
    }
};

export const getAllPosts = async () => {
    const postCollection = await posts();
    const postList = await postCollection.find({}).toArray();
    if (!postList) throw 'Could not get all posts';
    return postList;
};

export const get = async (postId) => {
    postId = validation.checkId(postId);
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: new ObjectId(postId)});
    if (!post) throw 'Error: Post not found';
    return post;
};

export const update = async (post) => {
    let postId = validation.checkId(post._id.toString());
    // validate post exists
    const postsCollection = await posts();
    const updateInfo = await postsCollection.findOneAndUpdate(
    {_id: new ObjectId(post._id)},
    {$set: post},
    {returnDocument: 'after'}
  );
  if (!updateInfo)
    throw `Error: Update failed, could not find a event with id of ${id}`;
  return updateInfo;
}

export const getFrequencyBreakdown = async (postContent) => {
    //let id = postContent.id;
    //let content = postContent.body;

    let testStr = "THIS IS A a test string to find al the words~!";
    // split all words on white space
    let words = content.split(' ');
    let wordCountMap = {};
    for(word in words){
        if(wordCountMap[word])
            wordCountMap[word]++;
        else
            wordCountMap[word] = 1; 
    }
    return wordCountMap;
};
