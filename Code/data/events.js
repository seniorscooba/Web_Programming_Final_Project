import validation from '../validation.js';
import {events} from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb'


// get event by id
export const get = async (id) => {
  let eventId = validation.checkId(id);
  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: new ObjectId(eventId)});
  if (!event) throw 'Error: event not found';
  return event;
};

// get all events
export const getAllEvents = async () => {
  let eventCol = await events();
  let eventList = await eventCol.find({}).toArray();
  if (!eventList) { throw "Could not get all events" }
  return eventList;
};

// create event
export const createEvent = async (
  userId,
  eventName, 
  eventDescription,
  eventLocation,
  eventDate,
  eventTime
) => {
  userId = validation.checkId(userId, "user id")
  eventName = validation.checkString(eventName, "event name")
  eventDescription = validation.checkString(eventDescription, "event description")
  eventLocation = validation.checkString(eventLocation, "event location")
  eventDate = validation.checkDate(eventDate, "event date")
  eventTime = validation.checkTime(eventTime, "event time")

  let eventCollection = await events();
  let newEvent = {
    eventId : new ObjectId(),
    user : userId,
    eventName : eventName,
    description : eventDescription,
    eventLocation : eventLocation,
    eventTime : eventTime,
    eventDate : eventDate,
    attendeeList : [],
    attend : false
  }
  let insert = await eventCollection.insertOne(newEvent)
  if (!insert.acknowledged || !insert.insertedId) { throw "Could not add event" }
  let newId = insert.insertedId.toString();
  let event = await get(newId);
  event._id = newId.toString();
  return await get(insertionStatus.insertedId.toString());
};


// delete event
export const remove = async (id) => {
  if (!id) { throw "Id must exist" }
  if (typeof id != 'string') { throw "Id must be of type string" }
  if (id.trim().length === 0) { throw "Id cannot be an empty string" }
  if (!ObjectId.isValid(id)) { throw " Id is not a valid object" }
  let eventCol = await events();
  let deleted = await eventCol.deleteOne({_id: new ObjectId(id)});
  if (deleted.deletedCount === 0) { throw "Could not delete event" }
  return { deleted : true };
};



export const rename = async (id, newEventName) => {
  if (!id) { throw "Id must exist" }
  if (!newEventName) { throw "newEventName must exist" }
  if (typeof id != 'string') { throw "Id must be of type string" }
  if (typeof newEventName != 'string') { throw "newEventName must be of type string" }
  if (id.trim().length === 0) { throw "Id cannot be an empty string" }
  if (newEventName.trim().length === 0) { throw "newEventName cannot be an empty string" }
  if (!ObjectId.isValid(id)) { throw " Id is not a valid object" }
  let event = await get(id);
  if (event.name === newEventName) { throw "newEventName cannot be the same as the old name" }
  let eventCol = await events();
  let updatedName = { eventName : newEventName };
  let updated = await eventCol.findOneAndUpdate({_id: new ObjectId(id)}, {$set: updatedName}, {returnDocument: 'after'});
  if (updated.modifiedCount === 0) { throw "Could not update event name" }
  return updated;
};


export const update = async (event) => {
  let eventId = validation.checkId(event._id.toString());
  // validate post exists
  const eventCollection = await events();
  const updateInfo = await eventCollection.findOneAndUpdate(
  {_id: new ObjectId(event._id)},
  {$set: event},
  {returnDocument: 'after'}
);
if (!updateInfo)
  throw `Error: Update failed, could not find a event with id of ${eventId}`;
return updateInfo;
}

