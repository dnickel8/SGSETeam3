var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
const utils = require("../utils");

const uri = utils.database;

const asyncMiddleware = fn =>
  (req, res, next) => 
  {
    return Promise.resolve(fn(req, res, next))
      .catch(next);
  };

async function getPicture(pictureId)
{
  console.log("Gesuchtes Bild:" + pictureId);
  const client = new MongoClient(uri);
  returnArr = [];
  try
  {
    await client.connect();
    const database = client.db("SGSE");

    //var query = { id: Number(pictureId) };
    var query =  { _id : new ObjectId(pictureId) };
    console.log(query);
    database.collection("SGSE_PICTURE").find(query).toArray(function(err, result) {
    if (err)
    {
      console.log(err);
      returnArr = [500 , ""];
    }
    else
    {
      if(result.length == 0)
      {
        returnArr = [404 , ""];
      }
      else
      {
        console.log("ResultArray:" + result[0]["_id"]);
        returnArr = [200, result[0]];
      }
    }
    })
  }
  catch
  {
    returnArr = [500 , ""];
  }
  finally
  {
    await client.close();
  }
  return returnArr;
}

router.get('/:id', asyncMiddleware(async (req, res, next) =>
 {
    console.log(req.params.id)
    var result = await getPicture(req.params.id);

    console.log("Status: " + result);
    if(result[0] == 200)
    {
      var dokument = result[1];
      console.log(dokument);
      res.status(200);
      res.json(dokument);
    }
    else if (result[0] == 404)
    {
      res.status(404).end('Not found');
    }
    else if (result[0] == 500)
    {
      res.status(500).end('Error');
    }
    
}));


module.exports = router;
