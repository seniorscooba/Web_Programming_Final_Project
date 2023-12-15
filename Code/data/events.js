import validation from '../validation.js';
import {events} from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb'


// get event by id
export const get = async (id) => {
  if (!id) { throw "Id must exist" }
  if (typeof id != 'string') { throw "Id must be of type string" }
  if (id.trim().length === 0) { throw "Id cannot be an empty string" }
  if (!ObjectId.isValid(id)) { throw " Id is not a valid object" }
  let eventCol = await events();
  let event = await eventCol.findOne({_id: new ObjectId(id)});
  if (event == null) { throw "No event with this Id" }
  event._id = event._id.toString();
  return event;
};

// get all events
export const getAll = async () => {
  let eventCol = await events();
  let eventList = await eventCol.find({}).toArray();
  if (!eventList) { throw "Could not get all events" }
  if (eventList.length === 0) { return []; }
  for (let x of eventList) {
    x._id = x._id.toString();
  }
  return eventList;
};

// create event
export const createEvent = async (
  eventName, 
  eventDescription,
  eventLocation,
  eventDate,
  eventTime
) => {
  eventName = validation.checkString(eventName, "event name")
  eventDescription = validation.checkString(eventDescription, "event description")
  eventLocation = validation.checkString(eventLocation, "event location")
  eventDate = validation.checkString(eventDate, "event date")
  eventTime = validation.checkString(eventTime, "event time")

  let eventCollection = await events();
  let newEvent = {
    _id : new ObjectId(),
    eventName : eventName,
    description : eventDescription,
    eventLocation : eventLocation,
    eventTime : eventTime,
    eventDate : eventDate,
    attendeeList : []
  }
  let insert = await eventCollection.insertOne(newEvent)
  if (!insert.acknowledged || !insert.insertedId) { throw "Could not add event" }
  let newId = insert.insertedId.toString();
  let event = await get(newId);
  event._id = newId.toString();
  return event
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

