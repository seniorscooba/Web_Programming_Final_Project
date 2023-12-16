//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';
import { eventData } from '../data/index.js'


router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    res.render('events', { title:'Events' });
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router
  .route('/events')
  .get(async (req, res) => {
  //code here for GET getAll
    try {
      const eventList = await eventData.getAll()
      res.json(eventList);
    } catch (e) {
      res.status(500).json({error: e});
    }
  }); 
  
router
  .route('/events') 
  .post(async (req, res) => {
    const body = req.body
    console.log(req.body)
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({error: 'There are no fields in the request body'});
    }
    try {
      body.eventName = validation.checkString(body.eventName, "event name")
      body.eventDescription = validation.checkString(body.eventDescription, "event description")
      body.eventLocation = validation.checkString(body.eventLocation, "event location")
      body.eventDate = validation.checkString(body.eventDate, "event date")
      body.eventTime = validation.checkString(body.eventTime, "event time")
    } catch (e) {
      return res.status(404).json(e);
    }
    try {
      await eventData.create(req.params.id, body.eventName, body.eventDescription, body.eventLocation, body.eventDate, body.eventTime);
      let event = await eventData.get(req.params.id);
      return res.status(200).json(event);
    } catch (e) {
      return res.status(404).json(e);
    }
  });

router
  .route('/events')
  .delete(async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) { throw "Id not valid" }
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let event = await eventData.get(req.params.id);
      if (!event) { throw "event does not exist" }
      await eventData.remove(req.params.id);
      return res.json({id: req.params.id, deleted: true});
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })

  /*
router
  .route('/events')
  .post(async (req, res) => {
    try {

    }
  })
*/
//export router
export default router;
