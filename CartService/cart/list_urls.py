from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import list_views

urlpatterns = [
    path('getArticles/<slug:userID>', list_views.get_article_count_cart, name="get_article_count_cart"),
    path('addArticle/<slug:userID>', list_views.get_article_count_cart, name="get_article_count_cart"),
    path('deleteArticle/<slug:userID>', list_views.get_article_count_cart, name="get_article_count_cart"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
