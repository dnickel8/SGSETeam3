var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
const utils = require("../utils");
var ObjectId = require('mongodb').ObjectId;

const uri = utils.database;

const asyncMiddleware = fn =>
  (req, res, next) => 
  {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

async function getCategory()
{
  const client = new MongoClient(uri);
  returnArr = [];
  try
  {
    await client.connect();
    const database = client.db("SGSE");
    
    var categories = await database.collection("SGSE_ARTICLE").distinct("data.kategorie", {})
    returnArr = [200 , categories];
  }
  catch(e)
  {
    console.log(e);
    if(articleId.length <= 23 && articleId.length > 0)
    {
      returnArr = [404 , ""];
    }
    else
    {
      returnArr = [500 , ""];
    }
  }
  finally
  {
    await client.close();
  }
  return returnArr;
}

router.get('/', asyncMiddleware(async (req, res, next) =>
 {
    var result = await getCategory();

    if(result[0] == 200)
    {
      var dokument = result[1];
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
