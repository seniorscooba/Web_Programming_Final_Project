//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';

router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try {
    if(req.session.user)
        res.render('posts', { title:'Posts', loggedIn:true });
      else
        res.render('posts', { title:'Posts', loggedIn:false });
  } catch (e) {
    res.status(500).json({error: e});
  }
});


router.route('/').post(async (req, res) => {
  //code here for POST this is where your form will be submitting searchCharacterByName and then call your data function passing in the searchCharacterByName and then rendering the search results of up to 15 characters.
// noticed searchCharacterByName in body, need to extract
const SEARCH_ID_NAME = "searchCharacterByName";
try {
  if(SEARCH_ID_NAME in req.body)
  {
    let userCharacterQuery = req.body[SEARCH_ID_NAME];

    // check if 400 error
    userCharacterQuery = userCharacterQuery.trim();
    if(userCharacterQuery == ''){
      res.status(400);
      res.render('error', {hasErrors: true,
        error: '400 Error: Enter search name',
        title:'Posts'});
    }

    const characterList = await characterData.searchCharacterByName(userCharacterQuery);
    // make query to API
    res.status(200);
    if(characterList.length > 0)
      res.render('characterSearchResults', {characters: characterList,
        searchName: userCharacterQuery,
        title:'Marvel Characters Found'});
    else
      res.render('error', {hasErrors: true,
        error: `We're sorry, but no results were found for ${userCharacterQuery} in API`,
        title:'Marvel Characters Found'});
  }
} catch (e) {
}
});

//export router
export default router;
