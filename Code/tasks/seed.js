import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as posts from '../data/posts.js';
import * as users from '../data/users.js';

const db = await dbConnection();
await db.dropDatabase();

const user1 = await users.registerUser(
  'Steve',
  'Vaz',
  'stevevaz@gmail.com',
  'Pass123!',
  'user'
);

const user1Id = user1._id.toString();
const post1 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is some seed post data yall",
  user1.postVotes
);
//const removed = await attendees.removeAttendee(attendee._id.toString());
//const deletedInfo = await events.remove(event1Id);

console.log('Done seeding database');

await closeConnection();
