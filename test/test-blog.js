'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// this lets us use *should* style syntax in our tests
// so we can do things like `(1 + 1).should.equal(2);`
// http://chaijs.com/api/bdd/
const should = chai.should();

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('Blog', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list Blog posts on GET', function() {
        return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
          const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
          res.body.forEach(function(item) {
              item.should.be.a('object');
              item.should.include.keys(expectedKeys);
          });
      });
    });

    it('should add an blog-post on POST', function() {
        const newBlog = {title: 'cloudy today', author:'saule', content:'cloudy today and should be nicer tomorrow'};
        return chai.request(app)
      .post('/blog-posts')
      .send(newBlog)
      // .then(function(res) {
      //     newBlog.publishDate = res.body[0].publishDate;
      //     console.log(res);
      //     return chai.request(app);
      // })
      .then(function(res){
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('id', 'title', 'content', 'author','publishDate');
          res.body.id.should.not.be.null;
        // response should be deep equal to `newItem` from above if we assign
        // `id` to it from `res.body.id`
          res.body.should.deep.equal(Object.assign(newBlog, {id: res.body.id},{publishDate:res.body.publishDate}));
      });
    });



});