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

const user2 = await users.registerUser(
  'Zach',
  'Scarpati',
  'zscarpat@stevens.edu',
  '!5million',
  'user'
);

const user3 = await users.registerUser(
  'Angelo',
  'Saez',
  'asaez2@stevens.edu',
  'un1qu3passW0rd',
  'user'
)

const user4 = await users.registerUser(
  'Pat',
  'Hill',
  'phill@stevens.edu',
  'il0v3webProgramm1nG',
  'user'
)

const user5 = await users.registerUser(
  'Mistor',
  'Guy',
  'mguy@stevens.edu',
  'heygUysM1st0RguyHere',
  'user'
)

const user1Id = user1._id.toString();
const post1 = await posts.createPost(
  user1Id,
  user1.userName,
  "This is a post title",
  "some seed post data yall"
);
const post2 = await posts.createPost(
  user4._id.toString(),
  user4.userName,
  "This is a second post",
  "some seed post data yall"
);
const post3 = await posts.createPost(
  user5._id.toString(),
  user5.userName,
  "This is a third post",
  "some seed post data yall"
);
//const removed = await attendees.removeAttendee(attendee._id.toString());
//const deletedInfo = await events.remove(event1Id);

let event1 
let event2
let event3
let event4

try {
    event1 = await events.createEvent(
        user2._id.toString(),
        "Zach's Birthday Bash",
        "Come one come all, celebrate my 22nd birthday party",
        "12 Garden St, Apt 1, Hoboken, NJ, 07030",
        "04/05/2024",
        "3:00 PM"
    )
    event2 = await events.createEvent(
      user1._id.toString(),
      "Amateur Open-Mic!!!",
      "Come perform or spectate amongst other artists!",
      "123 Coffee Drive, Caffeine, California",
      "02/23/2024",
      "9:00 PM"
    )

      event3 = await events.createEvent(
        user2._id.toString(),
        "Fortnite Pool Party",
        "were dropping tilted towers at this fortnite themed pool party",
        "77 Weeping Woods, Fortnite Ave, Hollywood USA",
        "10/24/2028",
        "10:00 AM"
      )

      event4 = await events.createEvent(
        user4._id.toString(),
        "Web Programming Event",
        "come program with me and learn a thing or two about javascript!",
        "Gateway North Hall, Stevens Campus",
        "12/31/2023",
        "12:00 PM"
      )

    console.log(event1)
    console.log(event2)
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
    let get_all_events = await events.getAllEvents()
    console.log(get_all_events)
} catch(e) {
    console.log(e)
}

try {
  let get_all_posts = await posts.getAllPosts()
  console.log(get_all_posts)
} catch(e) {
  console.log(e);
}



await closeConnection();
