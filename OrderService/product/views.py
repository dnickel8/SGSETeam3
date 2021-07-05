import json
from pymongo import MongoClient
from bson.json_util import dumps
from bson import json_util
from bson.objectid import ObjectId

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view

class GetOrders(APIView):
    def get(self, request, user_id):
        myclient = MongoClient("mongodb://localhost:27017")
        db = myclient["micro-shop"]
        collection = db["order"]
        cursor = collection.find({'user': {'id': user_id}})
        list_cur = list(cursor)
        json_data = dumps(list_cur)

        return Response(json_data.replace('\\', ''))

class GetOrder(APIView):
    def get(self, request, user_id, order_id):
        myclient = MongoClient("mongodb://localhost:27017")
        db = myclient["micro-shop"]
        collection = db["order"]
        cursor = collection.find({'_id': ObjectId(order_id), 'user': {'id': user_id}})
        list_cur = list(cursor)
        json_data = dumps(list_cur)

        return Response(json_data.replace('\\', ''))

@api_view(['POST'])
def placeOrder(request):
    myclient = MongoClient("mongodb://localhost:27017")
    db = myclient["micro-shop"]
    collection = db["order"]
    collection.insert_one(request.data)
    return Response(json.loads(json_util.dumps(request.data)))