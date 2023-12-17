//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';
import * as eventsData from '../data//events.js';
import { createEvent } from '../data/events.js';


router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {

    if (req.session.user) {
      const eventList = await eventsData.getAllEvents();
      res.render('events', { title:'Events', 
                            loggedIn:true,
                            events:eventList});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
router
  .route('/') 
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
        res.status(200).render('events', { title: "Events" });
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });





  router.route('/:id').get(async (req, res) => { // update checkbox
    try {
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });
  
  router.route('/:id').post(async (req, res) => { // update checkbox
    try {

      if (req.session.user) {
        let url = req.url.split('/');
        let id = url[1];
        if (req.body) {     
          let isChecked = req.body['checked'];
          let isNotChecked = req.body['notChecked'];
          let event = await eventsData.get(id);
          let user = req.session.user._id;
          if (isChecked != undefined) {
            let found = event.attendeeList.find((x) => x === user);
            event.attendeeList.push(user);
            eventsData.update(event)
          }
          else if(isNotChecked != undefined){
            let found = event.attendeeList.find((x) => x === user);
            if (found) {
              event.attendeeList = event.attendeeList.filter(function(item) {
                return item !== user
              })
            }
            eventsData.update(event)
          }
          else {
            throw "Failed to add attendee!";
          }
          res.status(200).redirect('/events');
        }
      }
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });



export default router;
