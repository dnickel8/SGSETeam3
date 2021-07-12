import json
import redis
import ast
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

# connect to our Redis instance
redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=0, decode_responses=True)


# Returns the wishlist's article count.
@api_view(['GET'])
def get_article_count(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not query article count.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully queried article count.', 'count': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        list_key = "user:" + user_id + ":list"

        # Get all article IDs from the user's wishlist
        item_ids = redis_instance.zrange(list_key, 0, -1)
        count = len(item_ids)

        return Response(data=ast.literal_eval(response_200.format(count)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Gets all the user's articles in the wishlist.
@api_view(['GET'])
def get_articles(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not query articles.', 'exception-type': '{0}', 'exception': '{1}' }}"

    try:
        user_id = kwargs["userID"]
        list_key = "user:" + user_id + ":list"

        # Get all article IDs from the user's wishlist
        item_ids = redis_instance.zrange(list_key, 0, -1)
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


# Adds an article to the wishlist.
# The product's information is kept inside a hash. The hash's id is kept inside a sorted set = the user's wishlist.
@api_view(['POST'])
def add_article(request, *args, **kwargs):

    response_200 = "{{ 'message': 'Article successfully added to wishlist.', 'list-item': '{0}' }}"
    response_500 = "{{ 'message': 'Could not add article.', 'exception-type': '{0}', 'exception': '{1}' }}"

    try:
        user_id = kwargs["userID"]
        list_key = "user:" + user_id + ":list"
        list_item_key_prefix = "user:" + user_id + ":list-item:"

        # New article dictionary
        request_data = json.loads(request.body)
        new_article = {
            "article_name": request_data['article_name'],
            "article_vendor": request_data['article_vendor'],
            "article_price": request_data['article_price'],
            "article_catalog_id": request_data['article_catalog_id'],
            "article_image": request_data['article_image']
        }

        # Get max item (highest id) from the user's wishlist (sorted set)
        max_item_id = redis_instance.zrevrange(list_key, 0, 0, withscores=True)

        if max_item_id:
            # List is not empty
            max_id = int(max_item_id[0][1])
            new_id = str(max_id + 1)
            list_item_key = list_item_key_prefix + new_id

            redis_instance.zadd(list_key, {list_item_key: new_id})
            redis_instance.hmset(list_item_key, new_article)
            return Response(data=ast.literal_eval(response_200.format(list_item_key)), status=200)
        else:
            # List is empty or does not exist
            list_item_key = list_item_key_prefix + "0"

            redis_instance.zadd(list_key, {list_item_key: 0})
            redis_instance.hmset(list_item_key, new_article)
            return Response(ast.literal_eval(response_200.format(list_item_key)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)


# Deletes a wishlist article.
@api_view(['DELETE'])
def delete_article(request, *args, **kwargs):

    response_500 = "{{ 'message': 'Could not delete the article.', 'exception-type': '{0}', 'exception': '{1}' }}"
    response_200 = "{{ 'message': 'Successfully deleted the wishlist article.', 'deleted-article': '{0}' }}"

    try:
        user_id = kwargs["userID"]
        article_id = kwargs["articleID"]
        list_key = "user:" + user_id + ":list"

        pipeline = redis_instance.pipeline()
        pipeline.zrem(list_key, article_id)
        pipeline.delete(article_id)
        pipeline.execute()

        return Response(data=ast.literal_eval(response_200.format(article_id)), status=200)

    except Exception as e:
        return Response(data=ast.literal_eval(response_500.format(e.__class__.__name__, e)), status=500)
