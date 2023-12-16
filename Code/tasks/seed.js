import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as posts from '../data/posts.js';
import * as events from '../data/events.js';
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
const post2 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is a second post",
  user1.postVotes
);
const post3 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is a third post",
  user1.postVotes
);
//const removed = await attendees.removeAttendee(attendee._id.toString());
//const deletedInfo = await events.remove(event1Id);

console.log('Done seeding database');

await closeConnection();

let event1 

try {
    event1 = await events.createEvent(
        "Zach's Birthday Bash",
        "Come one come all, celebrate my 22nd birthday party",
        "15 fortnite street, hollywood blvd",
        "3:00PM",
        "April 5, 2024"
    )
    console.log(event1)
} catch(e) {
    console.log(e)
}

try {
    let get_event = await events.get(event1._id)
    console.log(get_event)
} catch(e) {
    console.log(e)
}

try {
    console.log("---------------------------GETALL---------------------------")
    let get_all = await events.getAll()
    console.log(get_all)
} catch(e) {
    console.log(e)
}


await closeConnection();
