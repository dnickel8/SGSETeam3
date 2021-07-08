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

async function getResults(searchterm, body)
{
  const client = new MongoClient(uri);
  returnArr = [];

  var query = `{
                "$and": 
                [
                  @hersteller 
                  @kategorie
                  {
                    "$or":
                    [
                      {
                        "data.articlename": 
                        {
                          "$regex": "@searchterm" 
                        }
                      },
                      {
                        "data.description": 
                        {
                          "$regex": "@searchterm" 
                        }
                      },
                      {
                        "data.details.value": 
                        {
                          "$regex": "@searchterm" 
                        }
                      }
                    ]
                  }
                  @price
                ]
              }`;

  query = query.replace("@searchterm", searchterm);
  query = query.replace("@searchterm", searchterm);
  query = query.replace("@searchterm", searchterm);

  if(body["preisMin"] != undefined || body["preisMax"] != undefined)
  {
    query = query.replace("@price", ", { \"data.price\": { \"$gte\" :  @priceMin, \"$lte\" : @priceMax} }");
    if(body["preisMin"] != undefined)
    {
      query = query.replace("@priceMin", body["preisMin"]);
    }
    else
    {
      query = query.replace("@priceMin", "-1");
    }
    if(body["preisMax"] != undefined)
    {
      query = query.replace("@priceMax", body["preisMax"]);
    }
    else
    {
      query = query.replace("@priceMin", "999999999");
    }
  }
  else
  {
    query = query.replace("@price", "");
  }

  if(body["hersteller"] != undefined)
  {
    query = query.replace("@hersteller", "{ \"data.hersteller\": { \"$in\": [ @hersteller ] }} , ")
    for(let i = 0; i < body["hersteller"].length; i++)
    {
      if(i+1 == body["hersteller"].length)
      {
        query = query.replace("@hersteller", "\"" + body["hersteller"][i] + "\"");
      }
      else
      {
        query = query.replace("@hersteller", "\"" + body["hersteller"][i] + "\", @hersteller");
      }
    }
  }
  else
  {
    query = query.replace("@hersteller", "")
  }
  if(body["kategorie"] != undefined)
  {
    query = query.replace("@kategorie", "{ \"data.kategorie\": { \"$in\": [ @kategorie] }}, ")

    for(let i = 0; i < body["kategorie"].length; i++)
    {
      if(i+1 == body["kategorie"].length)
      {
        query = query.replace("@kategorie", "\"" + body["kategorie"][i] + "\"");
      }
      else
      {
        query = query.replace("@kategorie", "\"" + body["kategorie"][i] + "\", @kategorie");
      }
    }
  }
  else
  {
    query = query.replace("@kategorie", "")
  }
  //console.log(query);
  try
  {
    query = JSON.parse(query);
  }
  catch(e)
  {
    console.log(e);
    returnArr = [500 , ""];
    return returnArr;
  }
  
  try
  {
    await client.connect();
    const database = client.db("SGSE");

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

router.post('/:searchterm', asyncMiddleware(async (req, res, next) =>
{
  var result = await getResults(req.params.searchterm, req.body["data"]);

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
