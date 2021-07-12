var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();
const utils = require("../utils");
var ObjectId = require('mongodb').ObjectId;

const uri = utils.database;

const asyncMiddleware = fn =>
  (req, res, next) => 
  {
    return Promise.resolve(fn(req, res, next))
      .catch(next);
  };

async function getArticle(articleId)
{
  console.log(typeof(articleId));
  const client = new MongoClient(uri);
  returnArr = [];
  try
  {
    await client.connect();
    const database = client.db("SGSE");
    var query =  { "_id" : new ObjectId(articleId) };
    
    database.collection("SGSE_ARTICLE").find(query).toArray(function(err, result) {
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
        returnArr = [200, result[0]];
      }
    }
    })
  }
  catch
  {
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

router.get('/:id', asyncMiddleware(async (req, res, next) =>
 {
    var result = await getArticle(req.params.id);

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
