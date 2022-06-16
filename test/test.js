




const { assert } = require('chai');

const getUserByEmail = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const input = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID"
    assert.equal(input, expectedOutput)
  });
  it('should return a user with a valid email', function() {
    const input = getUserByEmail(undefined, testUsers)
    const expectedOutput = undefined
    assert.equal(input, expectedOutput)
  });
  it('should return a user with valid email', function() {
    const input = getUserByEmail("user1@example.com", testUsers)
    const expectedOutput = undefined
    assert.equal(input, expectedOutput)
  });
});