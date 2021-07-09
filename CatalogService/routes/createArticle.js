var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
const utils = require("../utils");

const uri = utils.database;

const asyncMiddleware = fn =>
  (req, res, next) => 
  {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

async function insert(document)
{
  if(!document["data"] || !document["data"]["price"] || !document["data"]["articlename"] || !document["data"]["description"] || !document["data"]["details"] || !document["data"]["pictures"])
  {
    return -2;
  }
  const client = new MongoClient(uri);
  let success = "-1";
  try
  {
    await client.connect();
    const database = client.db("SGSE");

    await database.collection("SGSE_ARTICLE").insertOne(document, function(err, res)
    {
      if (err)
      {
        success = "-1";
      }
      else
      {
        success = success = res["insertedId"]
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

    if (result == -2)
    {
      res.status(400).end('Invalid Data');
    }
    else if(result != "-1")
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
