from django.urls import path, include

from product import views

urlpatterns = [
    path('getOrders/<str:user_id>/', views.GetOrders.as_view()),
    path('getOrder/<str:user_id>/<str:order_id>/', views.GetOrder.as_view()),
    path('placeOrder/', views.placeOrder),
]