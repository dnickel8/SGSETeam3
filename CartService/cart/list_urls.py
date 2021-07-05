from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import list_views

urlpatterns = [
    path('getArticleCount/<userID>', list_views.get_article_count, name="list_get_article_count"),
    path('getArticles/<userID>', list_views.get_articles, name="list_get_articles"),
    path('addArticle/<userID>', list_views.add_article, name="list_add_article"),
    path('deleteArticle/<userID>/<articleID>', list_views.delete_article, name="list_delete_article"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
