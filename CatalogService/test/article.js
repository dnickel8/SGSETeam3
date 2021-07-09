const chai = require('chai');
const expect = require('chai').expect;
const chaiHttp = require('chai-http');
var assert = require('assert');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

const app = require('../app.js')
chai.use(chaiHttp);

var articleId = "";

var testArtikel = {
    "data": {
        "articlename":"TEST",
        "description":"TEST",
        "price":"1099",
        "hersteller":"TEST",
        "kategorie":"TEST",
        "details":[
        {
            "key":"TEST_KEY_1",
            "value":"TEST_VALUE_1"
        },
        {
            "key":"TEST_KEY_2",
            "value":"TEST_VALUE_2"
        },
        {
            "key":"TEST_KEY_3",
            "value":"TEST_VALUE_3"
        } 
        ],
        "pictures":[
            1
        ]
    }
}

 var testArtikel2 = {
    "data": {
        "articlename":"TEST2",
        "description":"TEST2",
        "hersteller":"TEST",
        "kategorie":"TEST",
        "price":"1099",
        "details":[
        {
            "key":"TEST_KEY_1",
            "value":"TEST_VALUE_1"
        },
        {
            "key":"TEST_KEY_2",
            "value":"TEST_VALUE_2"
        }
        ],
        "pictures":[
            1,
            3
        ]
    }
 }

 var invalidArtikel = { "TEST": "TEST" };

 //ungültigen artikel anlegen
it('create invalid article', (done) =>
{
    chai.request(app)
        .post("/createArticle/")
        .send(invalidArtikel)
        .end((err, res) =>
         {
            expect(res).to.have.status(400);
            done();
         })
})

//falsche Route
it('invalid route', (done) =>
{
    chai.request(app)
        .get("/getArtikel/")
        .end((err, res) =>
         {
            expect(res).to.have.status(404);
            if(err) return done(err);
            done();
         })    
})

//einzelnen Artikel abrufen mit unbekannter Artikel ID
it('get Article invalid ID', (done) =>
{
    chai.request(app)
        .get("/getArticle/-1")
        .end((err, res) =>
         {
            expect(res).to.have.status(404);
            if(err) return done(err);
            done();
         })    
})

//delete article invalid ID
it('delete Article invalid ID', (done) =>
{
    chai.request(app)
        .get("/deleteArticle/-1")
        .end((err, res) =>
         {
            expect(res).to.have.status(404);
            if(err) return done(err);
            done();
         })    
})

//change article invalid ID
it('change Article invalid ID', (done) =>
{
    chai.request(app)
        .put("/changeArticle/-1")
        .send(testArtikel2)
        .end((err, res) =>
         {
            expect(res).to.have.status(500);
            if(err) return done(err);
            done();
         })    
})

//hersteller test
it('get manufacturer test', (done) =>
{
    //artikel erstellen
    chai.request(app)
        .post("/createArticle/")
        .send(testArtikel)
        .end((err, res) =>
         {
            expect(res).to.have.status(200);
            articleId = res.body;
            //hersteller abfragen
            chai.request(app)
                .get("/getManufacturer")
                .end((err, res) =>
                {
                    if(err) return done(err);
                    expect(res.body).to.include('TEST');
                    //artikel löschen
                    chai.request(app)
                        .delete("/deleteArticle/" + articleId)
                        .end((err, res) =>
                        {
                            expect(res).to.have.status(200);
                            if(err) return done(err);
                            done();
                        })    
                })    
         })    
})

//Kategorie test
it('get category test', (done) =>
{
    //artikel erstellen
    chai.request(app)
        .post("/createArticle/")
        .send(testArtikel)
        .end((err, res) =>
         {
            expect(res).to.have.status(200);
            articleId = res.body;
            //hersteller abfragen
            chai.request(app)
                .get("/getCategory")
                .end((err, res) =>
                {
                    if(err) return done(err);
                    expect(res.body).to.include('TEST');
                    //artikel löschen
                    chai.request(app)
                        .delete("/deleteArticle/" + articleId)
                        .end((err, res) =>
                        {
                            expect(res).to.have.status(200);
                            if(err) return done(err);
                            done();
                        })    
                })    
         })    
})

//einzelnen Artikel anlegen, abrufen, ändern, erneut abrufen und wieder löschen
it('combined test', (done) =>
{
    //artikel erstellen
    chai.request(app)
        .post("/createArticle/")
        .send(testArtikel)
        .end((err, res) =>
         {
            expect(res).to.have.status(200);
            assert.notEqual("", res.body)
            articleId = res.body;
            //artikel überprüfen
            chai.request(app)
                .get("/getArticle/" + articleId)
                .end((err, res) =>
                {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.nested.property('data.price');
                    expect(res.body).to.have.nested.property('data.articlename');
                    expect(res.body).to.have.nested.property('data.articlename');
                    expect(res.body).to.have.nested.property('data.description');
                    expect(res.body).to.have.nested.property('data.details');
                    expect(res.body).to.have.nested.property('data.pictures');
                    expect(res.body).to.have.nested.property('data.pictures').with.lengthOf(1);
                    expect(res.body).to.have.nested.property('data.details').with.lengthOf(3);
                    if(err) return done(err);
                    //artikel ändern
                    chai.request(app)
                        .put("/changeArticle/" + articleId)
                        .send(testArtikel2)
                        .end((err, res) =>
                        {
                            expect(res).to.have.status(200);
                            if(err) return done(err);
                            //artikel erneut überprüfen
                            chai.request(app)
                                .get("/getArticle/" + articleId)
                                .end((err, res) =>
                                {
                                    expect(res).to.have.status(200);
                                    expect(res.body).to.have.nested.property('data.price');
                                    expect(res.body).to.have.nested.property('data.articlename');
                                    expect(res.body).to.have.nested.property('data.articlename');
                                    expect(res.body).to.have.nested.property('data.description');
                                    expect(res.body).to.have.nested.property('data.details');
                                    expect(res.body).to.have.nested.property('data.pictures');
                                    expect(res.body).to.have.nested.property('data.pictures').with.lengthOf(2);
                                    expect(res.body).to.have.nested.property('data.details').with.lengthOf(2);
                                    if(err) return done(err);
                                    //artikel löschen
                                    chai.request(app)
                                        .delete("/deleteArticle/" + articleId)
                                        .end((err, res) =>
                                        {
                                            expect(res).to.have.status(200);
                                            if(err) return done(err);
                                            done();
                                        })
                                })    
                        })    
                })    
         })    
})

