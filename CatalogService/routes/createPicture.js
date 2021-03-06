var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
const utils = require("../utils");

const uri = utils.database;
//const uri = "mongodb://localhost:27017/";

const asyncMiddleware = fn =>
  (req, res, next) => 
  {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

var id = "";

async function insert(document)
{
  var idNr = ""
  const client = new MongoClient(uri);
  let success = "-1";
  try
  {
    await client.connect();
    const database = client.db("SGSE");

    await database.collection("SGSE_PICTURE").insertOne(document, function(err, res)
    {
      if (err)
      {
        success = "-1";
      }
      else
      {
        success = res["insertedId"]
      }
    }) 
  }
  catch
  {
    success = "-1"
  }
  finally
  {
    await client.close();
  }
  return success
}

router.post('/', asyncMiddleware(async (req, res, next) =>
 {
    
    var result = await insert(req.body);

    if(result != "-1")
    {
      res.status(200);
      res.json(result);
    }
    else
    {
      res.status(500).end('Error');
    }
}));


module.exports = router;
