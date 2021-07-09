const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const app = require('../app.js')
chai.use(chaiHttp);

var testPicture = 
    {
        "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkJCggKCAsLCQsKCwsLDhAMCgsNExcVEBQPFhISDhYSDxQPDxQSFBgTFhQZIBoeGRgrIRwkExwdMiIzKjclIjABBgsKCw0OCwwMDg4MDRAOHRQNDCIUFRcOHggXDBAWEBEXCxATFAsRGREeCRkMCCIYHRQPHRANDA8WEAsUFSMWGP/CABEIBAAEAAMBIgACEQEDEQH/xAA1AAEAAgMBAQEAAAAAAAAAAAAABAUBAgMGBwgBAQACAwEBAAAAAAAAAAAAAAABAgQFBgMH/9oADAMBAAIQAxAAAADyYvAAAAAAAAAAAAAAAAIABIAAAAAAAAAAAAAAAAAAAAAAAAAAIABIAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6TTnm2sN1ytLKss7jmInXszNXyx1X84vCyeGZQxPUa63f8AmFrWaDsNRi7EAAAAAAd7+HSVaZ675xVLVfG8q"
    }

//delete picture invalid ID
it('delete picture invalid ID', (done) =>
{
    chai.request(app)
        .delete("/deletePicture/-1")
        .end((err, res) =>
         {
            expect(res).to.have.status(500);
            if(err) return done(err);
            done();
         })    
})

//get picture invalid ID
it('get picture invalid ID', (done) =>
{
    chai.request(app)
        .get("/getPicture/-1")
        .end((err, res) =>
         {
            expect(res).to.have.status(500);
            if(err) return done(err);
            done();
         })    
})


//create and delete picture
//get picture invalid ID
it('combined test', (done) =>
{
    chai.request(app)
        .post("/createPicture/")
        .send(testPicture)
        .end((err, res) =>
         {
            expect(res).to.have.status(200);
            var pictureId = res.body;
            if(err) return done(err);
            chai.request(app)
                .get("/getPicture/" + pictureId)
                .end((err, res) =>
                {
                    expect(res).to.have.status(200);
                    if(err) return done(err);
                    chai.request(app)
                        .delete("/deletePicture/" + pictureId)
                        .end((err, res) =>
                        {
                            expect(res).to.have.status(200);
                            if(err) return done(err);
                            done();
                        })    
                })    
         })    
})