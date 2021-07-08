import json
from django.http import response
import requests
from django.test import TestCase
from rest_framework import status
from django.test.client import RequestFactory
from bson.objectid import ObjectId

class URLTests(TestCase):
    def test_place_order_valid_json(self):
        data = {
            "date": "4.5.2020",
            "total": 0,
            "user": {
                "id": "testUser"
            },
            "products": [
                {
                "name": "TestProdukt",
                "image": "https://picsum.photos/50/50",
                "count": 1,
                "price": 10
                }
            ]
        }
        response = self.client.post("/api/v1/placeOrder/", json.dumps(data), content_type="application/json")

        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_place_order_invalid_json(self):
        data = {
            "invalid_date": "4.5.2020",
            "total": 0,
            "user": {
                "id": "testUser"
            },
            "products": [
                {
                "name": "TestProdukt",
                "image": "https://picsum.photos/50/50",
                "count": 1,
                "price": 10
                }
            ]
        }
        response = self.client.post("/api/v1/placeOrder/", json.dumps(data), content_type="application/json")

        self.assertEquals(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_get_orders_existing_user(self):
        response = self.client.get('/api/v1/getOrders/123/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_orders_not_existing_user(self):
        response = self.client.get('/api/v1/getOrders/notExistingUser/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)