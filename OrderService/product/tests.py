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
        "date": "2021-07-12T13:51:45.535Z",
        "user": { "id": "123" },
        "products": [
            {
            "article_price": 53.99,
            "article_name": "Logitech G432",
            "article_count": 1,
            "article_catalog_id": "60e9da18d77e720014c613da",
            "article_vendor": "Logitech",
            "article_image": "data:image",
            "article_id": "user:23442792-703a-4016-a7ad-de0e5183144c:cart-item:0",
            "checkbox_value": True,
            "value": "test"
            },
            {
            "article_vendor": "Apple",
            "article_price": 190.49,
            "article_name": "Apple AirPods Pro",
            "article_count": "2",
            "article_catalog_id": "60eb4d1cd77e720014c61400",
            "article_image": "data:image",
            "article_id": "user:23442792-703a-4016-a7ad-de0e5183144c:cart-item:1",
            "checkbox_value": True
            }
        ],
        "address": {
            "firstName": "123",
            "lastName": "123",
            "street": "123",
            "number": "123",
            "postCode": "123",
            "city": "123"
        },
        "shippingAddress": {
            "firstName": "123",
            "lastName": "123",
            "street": "123",
            "number": "123",
            "postCode": "123",
            "city": "123"
        },
        "shippingMethod": {
            "name": "Rechnung",
            "description": "Rechnung",
            "price": 434.97
        }
        }
        response = self.client.post("/api/v1/placeOrder/", json.dumps(data), content_type="application/json")

        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_place_order_invalid_json(self):
        data = {
            "invalid": "data",
            "dasdfte": "2021-07-11T19:07:00.831Z",
            "user": { "id": "6e7c34fe-61f4-4851-ad5c-ee0809acee71" },
            "products": [
                {
                "article_name": "Logitech G432",
                "article_vendor": "Logitech",
                "article_price": 53.99,
                "article_url": "60e9da18d77e720014c613da",
                "article_imagepath": "image_url",
                "article_count": 1,
                "article_id": "user:6e7c34fe-61f4-4851-ad5c-ee0809acee71:cart-item:0",
                "checkbox_value": True
                }
            ],
            "address": {
                "firstName": "asdasd",
                "lastName": "asdasd",
                "street": "asdasd",
                "number": "234",
                "postCode": "23423",
                "city": "asdasd"
            },
            "shippingAddress": {
                "firstName": "John",
                "lastName": "Doe",
                "street": "ESpachstr.",
                "number": "1",
                "postCode": "79111",
                "city": "Freiburg"
            },
            "shippingMethod": {
                "name": "PayPal",
                "description": "PayPal",
                "price": "53.99"
            }
        }
        response = self.client.post("/api/v1/placeOrder/", json.dumps(data), content_type="application/json")

        self.assertEquals(response.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_get_orders_existing_user(self):
        response = self.client.get('/api/v1/getOrders/123/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_orders_not_existing_user(self):
        response = self.client.get('/api/v1/getOrders/notExistingUser/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete(self):
        response = self.client.delete('/api/v1/deleteOrder/60e751167a64bbb3cb133e29/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)