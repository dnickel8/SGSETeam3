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

async function getArticle()
{
  console.log(typeof(articleId));
  const client = new MongoClient(uri);
  returnArr = [];
  try
  {
    await client.connect();
    const database = client.db("SGSE");

    database.collection("SGSE_ARTICLE").find("").toArray(function(err, result) {
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
        returnArr = [200, result];
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

router.get('/', asyncMiddleware(async (req, res, next) =>
 {
    console.log(req.params.id)
    var result = await getArticle();

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
