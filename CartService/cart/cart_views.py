import json
import redis
import ast
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# connect to our Redis instance
redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True)


# Returns the shopping cart's article count.
@api_view(['GET'])
def get_article_count(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not query article count.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully queried article count.', 'count': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        cart_key = "user:" + user_id + ":cart"

        # Get all article IDs from the user's shopping cart
        item_ids = redis_instance.zrange(cart_key, 0, -1)
        count = len(item_ids)

        return Response(data=ast.literal_eval(response_200.format(count)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Gets all the user's articles in the shopping cart.
@api_view(['GET'])
def get_articles(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not query articles.', 'exception-type': '{0}', 'exception': '{1}' }}"

    try:
        user_id = kwargs["userID"]
        cart_key = "user:" + user_id + ":cart"

        # Get all article IDs from the user's shopping cart
        item_ids = redis_instance.zrange(cart_key, 0, -1)
        count = len(item_ids)

        # Iterate through the IDs and get the articles from the hash
        articles = []
        for item_id in item_ids:
            article_info = redis_instance.hgetall(item_id)
            article_info["article_id"] = item_id
            articles.append(article_info)

        # Build the response
        response_200 = {
            'message': 'Articles successfully queried.',
            'count': count,
            'articles': articles
        }

        return Response(response_200, status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Adds an article to the shopping cart.
# The product's information is kept inside a hash. The hash's id is kept inside a sorted set = the user's cart.
@api_view(['POST'])
def add_article(request, *args, **kwargs):

    response_200 = "{{ 'message': 'Article successfully added to shopping cart.', 'cart-item': '{0}' }}"
    response_500 = "{{ 'message': 'Could not add article.', 'exception-type': '{0}', 'exception': '{1}' }}"

    try:
        user_id = kwargs["userID"]
        cart_key = "user:" + user_id + ":cart"
        cart_item_key_prefix = "user:" + user_id + ":cart-item:"

        # New article dictionary
        request_data = json.loads(request.body)
        new_article = {
            "article_name": request_data['article_name'],
            "article_vendor": request_data['article_vendor'],
            "article_price": request_data['article_price'],
            "article_url": request_data['article_url'],
            "article_imagepath": request_data['article_imagepath'],
            "article_count": 1
        }

        # Get max item (highest id) from the user's shopping cart (sorted set)
        max_item_id = redis_instance.zrevrange(cart_key, 0, 0, withscores=True)

        if max_item_id:
            # Cart is not empty
            max_id = int(max_item_id[0][1])
            new_id = str(max_id + 1)
            cart_item_key = cart_item_key_prefix + new_id

            redis_instance.zadd(cart_key, {cart_item_key: new_id})
            redis_instance.hmset(cart_item_key, new_article)
            return Response(data=ast.literal_eval(response_200.format(cart_item_key)), status=200)
        else:
            # Cart is empty or does not exist
            cart_item_key = cart_item_key_prefix + "0"

            redis_instance.zadd(cart_key, {cart_item_key: 0})
            redis_instance.hmset(cart_item_key, new_article)
            return Response(ast.literal_eval(response_200.format(cart_item_key)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Helper function that deletes an article from the shopping cart.
def delete_single_article(pipeline, cart_key, article_id):
    pipeline.zrem(cart_key, article_id)
    pipeline.delete(article_id)


# Deletes a shopping cart article.
@api_view(['DELETE'])
def delete_article(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not delete the article.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully deleted the shopping cart article.', 'deleted-article': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        article_id = kwargs["articleID"]
        cart_key = "user:" + user_id + ":cart"

        pipeline = redis_instance.pipeline()
        delete_single_article(pipeline, cart_key, article_id)
        pipeline.execute()

        return Response(data=ast.literal_eval(response_200.format(article_id)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Deletes all the articles in the shopping cart.
@api_view(['DELETE'])
def delete_articles(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not delete the articles.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully deleted the shopping cart articles.', 'count': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        cart_key = "user:" + user_id + ":cart"

        # Get all article IDs from the user's shopping cart
        item_ids = redis_instance.zrange(cart_key, 0, -1)
        count = len(item_ids)

        # Iterate through the IDs and get the articles from the hash + delete the articles
        pipeline = redis_instance.pipeline()
        for item_id in item_ids:
            delete_single_article(pipeline, cart_key, item_id)
        pipeline.execute()

        return Response(data=ast.literal_eval(response_200.format(count)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Deletes only the passed articles in the shopping cart.
@api_view(['DELETE'])
def delete_passed_articles(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not delete the articles.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully deleted the passed shopping cart articles.', 'count': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        cart_key = "user:" + user_id + ":cart"

        request_data = json.loads(request.body)
        article_ids = request_data["articles"]      # e.g. "articles": ["user:xyz:cart-item:2", "user:xyz:cart-item:5"]
        count = len(article_ids)

        # Iterate through the article_ids and delete the corresponding article
        pipeline = redis_instance.pipeline()
        for article_id in article_ids:
            delete_single_article(pipeline, cart_key, article_id)
        pipeline.execute()

        return Response(data=ast.literal_eval(response_200.format(count)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Updates the quantity of a shopping cart article.
@api_view(['PUT'])
def update_article_quantity(request, *args, **kwargs):

    response_200 = "{{ 'message': 'Quantity successfully updated.', 'cart-item': '{0}', 'quantity': '{1}' }}"
    response_500 = "{{ 'message': 'Could not update quantity.', 'exception-type': '{0}', 'exception': '{1}' }}"

    try:
        # Extract new quantity from JSON
        request_data = json.loads(request.body)
        article_id = request_data['article_id']
        new_quantity = request_data['new_quantity']

        # Update hash
        redis_instance.hset(article_id, "article_count", new_quantity)

        return Response(ast.literal_eval(response_200.format(article_id, new_quantity)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)
