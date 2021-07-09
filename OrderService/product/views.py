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
    '''
    schema = {
        "$schema": "http://json-schema.org/draft-06/schema#",
        "$ref": "#/definitions/Welcome7",
        "definitions": {
            "Welcome7": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "string"
                    },
                    "total": {
                        "type": "integer"
                    },
                    "user": {
                        "$ref": "#/definitions/User"
                    },
                    "products": {
                        "type": "array",
                        "items": {
                            "$ref": "#/definitions/Product"
                        }
                    }
                },
                "required": [
                    "date",
                    "products",
                    "total",
                    "user"
                ],
                "title": "Welcome7"
            },
            "Product": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "image": {
                        "type": "string",
                        "format": "uri",
                        "qt-uri-protocols": [
                            "https"
                        ]
                    },
                    "count": {
                        "type": "integer"
                    },
                    "price": {
                        "type": "integer"
                    }
                },
                "required": [
                    "count",
                    "image",
                    "name",
                    "price"
                ],
                "title": "Product"
            },
            "User": {
                "type": "object",
                "properties": {
                    "id": {
                        "type": "string"
                    }
                },
                "required": [
                    "id"
                ],
                "title": "User"
            }
        }
    }

    try:
        validate(instance=request.data, schema=schema)
    except:
        return Response("Data not acceptable", status=status.HTTP_406_NOT_ACCEPTABLE)
        '''

    collection.insert_one(request.data)
    return Response('ok')

@api_view(['DELETE'])
def deleteOrder(request, order_id):
    collection.delete_one({'_id': ObjectId(order_id)})
    return Response('ok')