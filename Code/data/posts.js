import validation from '../validation.js';
import { posts } from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

export const createPost = async (
    userId,
    userName,
    postBody,
    postVotes
) => {
    try {
        // validate post creation information
        // assumes userId and userName correct
        // create post
        postVotes = [];
        const newPost = {
            userId: userId,
            userName: userName,
            postBody: postBody,
            postVotes: postVotes
        };
        // insert post into database
        const postsCollection = await posts();
        const insertionStatus = await postsCollection.insertOne(newPost);
        if (!insertionStatus.insertedId) throw "Insert failed!";
        return await get(insertionStatus.insertedId.toString());
    } catch (e) {
        throw e;
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
