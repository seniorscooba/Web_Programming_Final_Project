//import mongo collections, bcrypt and implement the following data functions
import validation from '../validation.js';
import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import bcrypt, { compare } from 'bcrypt';

export const registerUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {

  try
  {
    // instantiate user object 
  const newUser = {};

  // For firstName, it should be a valid string (no empty spaces, should not contain numbers) and should be at least 2 characters long with a max of 25 characters. If it fails any of those conditions, you will throw an error.  
  newUser.firstName = validation.checkName(firstName, 'first name');
  // For lastName, it should be a valid string (no empty spaces, should not contain numbers) and should be at least 2 characters long with a max of 25 characters. If it fails any of those conditions, you will throw an error.  
  newUser.lastName = validation.checkName(lastName, 'Last name');
  
  // emailAddress should be a valid email address format. example@example.com
  // The emailAddress should be case-insensitive. So "PHILL@STEVENS.EDU", "phill@stevens.edu", "Phill@StEvEnS.eDu" should be treated as the same emailAddress. 
  //  YOU MUST NOT allow duplicate email addresses in the system. If the emailAddress supplied is already in the database you will throw an error stating there is already a user with that email address.
  newUser.emailAddress = validation.checkEmail(emailAddress);
  const usersCollection = await users();
  const existingEmail = await usersCollection.findOne({emailAddress: emailAddress});
  if(existingEmail) throw "Email already exists!";

  //  For the password, it must be a valid string (no empty spaces and no spaces but can be any other character including special characters) and should be a minimum of 8 characters long. If it fails any of those conditions, you will throw an error.  
  //  The constraints for password will be: There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character:  
  //  for example:  Not valid: test123, test123$, foobar, tS12$ | Valid: Test123$, FooBar123*, HorsePull748*%
  newUser.password = validation.checkPassword(password, "Password");

  //  For role, the ONLY two valid values are "admin" or "user". Your function can accept it in any case, but it should be stored as lowercase in the DB. If there is any other value supplied, throw an error.
  newUser.role = validation.checkRole(role, "Role");

  // hash password using bcrypt
  const saltRounds = 16;
  newUser.password = await bcrypt.hash(password, saltRounds);

  // insert the user's first name, last name, email address, hashed password and role into the database.
  const newInsertInformation = await usersCollection.insertOne(newUser);
  if (!newInsertInformation.insertedId) throw 'Insert failed!';
  return {'insertedUser' : true}
  }
  catch(exception)
  {
    throw exception;
  }
  
};

export const loginUser = async (emailAddress, password) => {
  emailAddress = validation.checkEmail(emailAddress);
  password = validation.checkPassword(password);

  // query the db for the email address
  const usersCollection = await users();

  // Query the db for the emailAddress supplied, if it is not found, throw an error stating "Either the email address or password is invalid".
  const user = await usersCollection.findOne({emailAddress: emailAddress});
  if(!user) throw "Either the email address or password is invalid";

  // If the emailAddress supplied is found in the DB, you will then use bcrypt to compare the hashed password in the database with the password input parameter.
  const saltRounds = 16;
  let comparedPassword = await bcrypt.compare(password, user.password);
  if(comparedPassword === true){
    return { firstName: user.firstName, lastName: user.lastName, emailAddress: emailAddress, role: user.role  };
  }
  else
    throw "Either the email address or password is invalid";
};
