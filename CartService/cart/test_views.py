import json
import redis
from django.conf import settings
from django.test import TestCase
from django.urls import reverse
from rest_framework import status


class ViewsTestCase(TestCase):

    def setUp(self):
        # connect to our Redis instance
        redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True)

        # Fake user and keys
        self.user_id = "SGSE2021FakeUser"
        cart_key = "user:" + self.user_id + ":cart"
        article_id_zero = "user:" + self.user_id + ":cart-item:0"
        article_id_one = "user:" + self.user_id + ":cart-item:1"

        # Test data
        self.article_zero = {
            "article_id": "user:" + self.user_id + ":cart-item:0",
            "article_name": "Kopfhöhrer",
            "article_vendor": "Bose",
            "article_price": "60.4",
            "article_url": "www.test.de",
            "article_imagepath": "/test/test/",
            "article_count": "1"
        }

        article_one = {
            "article_id": "user:" + self.user_id + ":cart-item:1",
            "article_name": "Microphon",
            "article_vendor": "Rode",
            "article_price": "230",
            "article_url": "www.test.de",
            "article_imagepath": "/test/test/",
            "article_count": "1"
        }

        # Delete previous test data
        pipeline = redis_instance.pipeline()
        pipeline.zrem(cart_key, article_id_zero)
        pipeline.delete(article_id_zero)
        pipeline.zrem(cart_key, article_id_one)
        pipeline.delete(article_id_one)
        pipeline.execute()

        # Insert test data
        pipeline = redis_instance.pipeline()
        pipeline.zadd(cart_key, {article_id_zero: 0})
        pipeline.hmset(article_id_zero, self.article_zero)
        pipeline.zadd(cart_key, {article_id_one: 1})
        pipeline.hmset(article_id_one, article_one)
        pipeline.execute()

    def test_get_article_count(self):
        response = self.client.get(reverse('cart_get_article_count', args=[self.user_id]))
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(int(result['count']), 2)

    def test_get_articles(self):
        response = self.client.get(reverse('cart_get_articles', args=[self.user_id]))
        result = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(int(result['count']), 2)
        self.assertEqual(result['articles'][0], self.article_zero)
