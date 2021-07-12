import json
from jsonschema import validate
from pymongo import MongoClient
from bson.json_util import dumps
from bson import json_util
from bson.objectid import ObjectId

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

client = MongoClient("mongodb+srv://mongo:123@cluster0.raszr.mongodb.net/micro-shop?retryWrites=true&w=majority")
db = client['micro-shop']
collection = db["order"]

class GetOrders(APIView):
    def get(self, request, user_id):
        cursor = collection.find({'user': {'id': user_id}})
        list_cur = list(cursor)
        if len(list_cur)==0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        else:
            json_data = dumps(list_cur)
            return Response(json_data.replace('\\', ''))

class GetOrder(APIView):
    def get(self, request, user_id, order_id):
        cursor = collection.find({'_id': ObjectId(order_id), 'user': {'id': user_id}})
        list_cur = list(cursor)
        if len(list_cur)==0:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        else:
            json_data = dumps(list_cur)
            return Response(json_data.replace('\\', ''))

@api_view(['POST'])
def placeOrder(request):
    schema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "$ref": "#/definitions/Welcome1",
    "definitions": {
        "Welcome1": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "string",
                    "format": "date-time"
                },
                "user": {
                    "$ref": "#/definitions/User"
                },
                "products": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Product"
                    }
                },
                "address": {
                    "$ref": "#/definitions/Address"
                },
                "shippingAddress": {
                    "$ref": "#/definitions/Address"
                },
                "shippingMethod": {
                    "$ref": "#/definitions/ShippingMethod"
                }
            },
            "required": [
                "address",
                "date",
                "products",
                "shippingAddress",
                "shippingMethod",
                "user"
            ],
            "title": "Welcome1"
        },
        "Address": {
            "type": "object",
            "properties": {
                "firstName": {
                    "type": "string",
                    "format": "integer"
                },
                "lastName": {
                    "type": "string",
                    "format": "integer"
                },
                "street": {
                    "type": "string",
                    "format": "integer"
                },
                "number": {
                    "type": "string",
                    "format": "integer"
                },
                "postCode": {
                    "type": "string",
                    "format": "integer"
                },
                "city": {
                    "type": "string",
                    "format": "integer"
                }
            },
            "required": [
                "city",
                "firstName",
                "lastName",
                "number",
                "postCode",
                "street"
            ],
            "title": "Address"
        },
        "Product": {
            "type": "object",
            "properties": {
                "article_name": {
                    "type": "string"
                },
                "article_vendor": {
                    "type": "string"
                },
                "article_price": {
                    "type": "number"
                },
                "article_url": {
                    "type": "string"
                },
                "article_imagepath": {
                    "type": "string"
                },
                "article_count": {
                    "$ref": "#/definitions/ArticleCount"
                },
                "article_id": {
                    "type": "string"
                },
                "checkbox_value": {
                    "type": "boolean"
                }
            },
            "required": [
                "article_count",
                "article_id",
                "article_imagepath",
                "article_name",
                "article_price",
                "article_url",
                "article_vendor",
                "checkbox_value"
            ],
            "title": "Product"
        },
        "ShippingMethod": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "price": {
                    "type": "number"
                }
            },
            "required": [
                "description",
                "name",
                "price"
            ],
            "title": "ShippingMethod"
        },
        "User": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "format": "uuid"
                }
            },
            "required": [
                "id"
            ],
            "title": "User"
        },
        "ArticleCount": {
            "anyOf": [
                {
                    "type": "integer"
                },
                {
                    "type": "string",
                    "format": "integer"
                }
            ],
            "title": "ArticleCount"
        }
    }
}

    try:
        validate(instance=request.data, schema=schema)
    except:
        return Response("Data not acceptable", status=status.HTTP_406_NOT_ACCEPTABLE)

    collection.insert_one(request.data)
    return Response('ok')

@api_view(['DELETE'])
def deleteOrder(request, order_id):
    collection.delete_one({'_id': ObjectId(order_id)})
    return Response('ok')