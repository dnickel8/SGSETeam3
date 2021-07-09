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

async function deletePicture(pictureId)
{
  const client = new MongoClient(uri);
  let code = -1

  try
  {
    await client.connect();
    const database = client.db("SGSE");

    var query =  { "_id" : new ObjectId(pictureId) };
    database.collection("SGSE_PICTURE").deleteOne(query,function(err, result) {
    if (err)
    {
      console.log(err);
      code = 500;
    }
    else
    {
      code = 200;
    }
    })
  }
  catch
  {
    code = 500;
  }
  finally
  {
    await client.close();
  }
  return code;
}

router.delete('/:id', asyncMiddleware(async (req, res, next) =>
 {
    var result = await deletePicture(req.params.id);

    if(result == 200)
    {    
      res.status(200).end('Ok');
    }
    else if (result == 500)
    {
      res.status(500).end('Error');
    }
    
}));


module.exports = router;
