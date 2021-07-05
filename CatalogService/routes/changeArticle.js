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

async function updateArticle(articleId, dokument)
{
  const client = new MongoClient(uri);
  var code = -1;
  const options = {
    upsert: false,
  };

  try
  {
    await client.connect();
    const database = client.db("SGSE");

    var query =  { _id : new ObjectId(articleId) };
    var result = await database.collection("SGSE_ARTICLE").replaceOne(query, dokument, options)

    if (result.modifiedCount === 0)
    {
      code = 404;
    }
    else
    {
      code = 200;
    }
  }
  catch
  {
    code = 500
  }
  finally
  {
    await client.close();
  }
  return code;
}

router.put('/:id', asyncMiddleware(async (req, res, next) =>
 {
    var result = await updateArticle(req.params.id, req.body);

    if(result == 200)
    {
      res.status(200).end('Ok');
    }
    else if (result == 404)
    {
      res.status(404).end('Not found');
    }
    else if (result == 500)
    {
      res.status(500).end('Error');
    }
    
}));


module.exports = router;
