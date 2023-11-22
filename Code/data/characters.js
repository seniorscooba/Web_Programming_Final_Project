//import axios, md5
import {ObjectId} from 'mongodb';
import validation from '../validation.js';
import md5 from 'blueimp-md5' //you will need to install this module;
import axios, * as others from 'axios';

const publickey = 'd7b330c29a02438855c6f57e47c6a781';
const privatekey = '4dc5ae77940b261157a8993c30e344165c403d35';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const getChararcterSearchUrl = (searchTerm) => {
  let searchQuery = `?nameStartsWith=${searchTerm}`;
  let searchUrl = baseUrl + searchQuery + '&limit=15' + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  return searchUrl;
};

export const searchCharacterByName = async (name) => {
  //Function to search the api and return up to 15 characters matching the name param
  try{
    let searchUrl = getChararcterSearchUrl(name);
    let characterData = await axios.get(searchUrl); 
    let charDataArr = characterData.data.data.results;
    return charDataArr;   
  }
  catch(exception){
    throw exception;
  }
};

const getSingleChararcterUrl = (characterId) => {
  let characterQuery = `/${characterId}?`;
  let characterUrl = baseUrl + characterQuery + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
  return characterUrl;
};

export const searchCharacterById = async (id) => {
  //Function to fetch a character from the api matching the id
  try{
    let singleUrl = getSingleChararcterUrl(id);
    let singleData = await axios.get(singleUrl); 
    let singleDataResults = singleData.data.data.results;
    return singleDataResults;     
  }
  catch(exception){
    throw exception;
  }
};
