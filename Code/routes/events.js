//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';
import { eventData } from '../data/index.js'
import { events } from '../config/mongoCollections.js';
import { createEvent } from '../data/events.js';


router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    res.render('events', { title:'Events' });
  } catch (e) {
    res.status(500).json({error: e});
  }
});



router.route('/events').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    if(req.session.user){
      const eventList = await events.getAll();
      res.render('events', { title:'Events', 
                            loggedIn:true,
                            events:eventList});
    }
      else
        res.render('events', { title:'Events', loggedIn:false });
  } catch (e) {
    res.status(500).json({error: e});
  }
});
  
router
  .route('/events') 
  .post(async (req, res) => {
    try {
      if (req.session.user) {
        let eventName = validation.checkString(req.body['eventName'], 'event name');
        let eventDescription = validation.checkString(req.body['eventDescription'], 'event description');
        let eventLocation = validation.checkString(req.body['eventLocation'], 'event location');
        let eventDate = validation.checkString(req.body['eventDate'], 'event date');
        let eventTime = validation.checkString(req.body['eventTime'], 'event time');
        let user = req.session.user;
        let returnEvent = await createEvent(user._id.toString(), eventName, eventDescription, eventLocation, eventDate, eventTime);
        
        console.log("made it to events")
        if (!returnEvent) {
          throw "Failed to insert event!";
        }
        res.status(200).redirect('/events');
      }
    } catch (e) {
      res.status(500).json({ error: e });
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
