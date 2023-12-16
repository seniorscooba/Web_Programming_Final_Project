import validation from '../validation.js';
import { posts } from '../config/mongoCollections.js';

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
