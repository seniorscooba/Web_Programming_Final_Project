import validation from '../validation.js';
import { posts } from '../config/mongoCollections.js';

export const createPost = async (
    userId,
    userName,
    postBody,
    postVotes
) => {
    try {
        // validate post creation information
        // assumes userId and userName correct
        validation.checkString(postText, "Post body");
        // create post
        const newPost = {
            userId: userId,
            userName: userName,
            postBody: postBody,
            postVotes: postVotes
        };
        // insert post into database
        const postsCollection = await posts();
        const insertionStatus = await postsColleciton.insertOne(newPost);
        if (!insertionStatus.insertedId) throw "Insert failed!";
        return { 'insertedUser': true };
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
