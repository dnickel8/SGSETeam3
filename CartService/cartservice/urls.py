"""
The `urlpatterns` list routes URLs to views.
"""
from django.urls import include, path

urlpatterns = [
    path('cart/', include('cart.cart_urls')),
    path('list/', include('cart.list_urls')),
]
