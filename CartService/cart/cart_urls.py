from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

import cart.cart_views
from . import cart_views

urlpatterns = [
    path('getArticleCount/<userID>', cart_views.get_article_count, name="cart_get_article_count"),
    path('getArticles/<userID>', cart_views.get_articles, name="cart_get_articles"),
    path('addArticle/<userID>', cart_views.add_article, name="cart_add_article"),
    path('deleteArticle/<userID>/<articleID>', cart_views.delete_article, name="cart_delete_article"),
    path('deleteArticles/<userID>', cart_views.delete_articles, name="cart_delete_articles"),
    path('deletePassedArticles/<userID>', cart_views.delete_passed_articles, name="cart_delete_passed_articles"),
    path('updateArticleQuantity', cart_views.update_article_quantity, name="cart_update_article_quantity"),
    path('test', cart_views.get_test, name="cart_test"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
