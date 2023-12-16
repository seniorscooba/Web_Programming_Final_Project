//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';
import { eventData } from '../data/index.js'


router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    const eventList = await eventData.getAll();
    res.render('events', { title:'Events',
                              loggedIn:true,
                              events:eventList });
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router
  .route('/') 
  .post(async (req, res) => {
    const body = req.body
    console.log(req.body)
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }
    try {
      body.eventNameInput = validation.checkString(body.eventNameInput, "event name")
      body.descriptionInput = validation.checkString(body.descriptionInput, "event description")
      body.eventLocationInput = validation.checkString(body.eventLocationInput, "event location")
      body.eventDateInput = validation.checkString(body.eventDateInput, "event date")
      body.eventTimeInput = validation.checkString(body.eventTimeInput, "event time")
    } catch (e) {
      return res.status(404).json(e);
    }
    try {
      let createdEvent = await eventData.createEvent(body.eventNameInput, body.descriptionInput, body.eventLocationInput, body.eventDateInput, body.eventTimeInput);
      let eventId = await eventData.get(createdEvent._id);
      res.status(200).redirect('/events');
    } catch (e) {
      return res.status(404).json(e);
    }
  });

export default router;
