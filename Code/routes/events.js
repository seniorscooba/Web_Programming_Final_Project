//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/characters.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import validation from '../validation.js';

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
    res.render('events', { title:'Events' });
  } catch (e) {
    res.status(500).json({error: e});
  }
});

router.route('/searchmarvelcharacters').post(async (req, res) => {
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
        title:'Marvel Characters Found'});
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

router.route('/marvelcharacter/:id').get(async (req, res) => {
  //code here for GET a single character
  try
  {
    let url = req.url.split('/');
    let id = url[2];
    let singleData = await characterData.searchCharacterById(id);
    if(singleData == undefined || singleData.length < 1)
      throw "Error";
    let imgData = singleData[0]['thumbnail'];
    let imgPath = imgData.path + '.' + imgData.extension;
    res.render('characterById', {singleData: singleData,
                    imgPath: imgPath,
                    title: singleData[0]['name']});
  }
  catch(exception){
    res.status(404);
    res.render('error', {hasErrors: true,
      error: '404 Error: Could not find that character'});
  }
});

//export router
export default router;
