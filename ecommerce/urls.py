from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('', views.home, name="home"),
    path('api/', views.productAPI, name="api"),
    path('api/product/<slug:slug>/', views.productDetail, name = "product_detail"),
    path('api/cart/add/', views.AddToCartApiView.as_view(), name="add_to_cart"),
    path('api/cart/delete/<int:id>/', views.CartItemDelete.as_view(), name="delete_item"),
    path('api/token/', obtain_auth_token, name='api_token_auth'),
    path('api/<str:category>/', views.categoryAPI, name="category_api"),
]
