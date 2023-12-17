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
  "This is a post title",
  "some seed post data yall"
);
const post2 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is a second post",
  "some seed post data yall"
);
const post3 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is a third post",
  "some seed post data yall"
);
//const removed = await attendees.removeAttendee(attendee._id.toString());
//const deletedInfo = await events.remove(event1Id);

let event1 

try {
    event1 = await events.createEvent(
        "Zach's Birthday Bash",
        "Come one come all, celebrate my 22nd birthday party",
        "15 fortnite street, hollywood blvd",
        "April 5, 2024",
        "3:00PM"
    )
    event2 = await events.createEvent(
      "Amateur Open-Mic!!!",
      "Come perform or spectate amongst other artists!",
      "123 Coffee Drive, Caffeine, California",
      "April 5, 2024",
      "3:00PM"
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
