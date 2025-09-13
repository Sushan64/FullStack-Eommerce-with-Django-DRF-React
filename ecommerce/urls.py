from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenVerifyView

urlpatterns = [
    path('', views.home, name="home"),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.CustomLoginView.as_view(), name='token_obtain_pair'),
    path('logout/', views.LogoutView.as_view(), name="logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name="token_verify"),
    path('api/', views.ProductAPI.as_view(), name="api"),
    path('api/product/<slug:slug>/', views.productDetail, name = "product_detail"),
    path('api/attributes/', views.AttributeAPIView.as_view(), name="attribute"),
    path('api/review/add/', views.AddReviewView.as_view(), name='review'),
    path('api/profile/', views.ProfileView.as_view(), name='profile'),
    path('api/profile/my-upload/', views.UserUploadedProduct.as_view()),
    path('api/change-password/', views.ChangePasswordView.as_view(), name="change_password"),
    path('api/cart/add/', views.AddToCartApiView.as_view(), name="add_to_cart"),
    path('api/cart/delete/<int:id>/', views.CartItemDelete.as_view(), name="delete_item"),
    path('api/review/delete/<int:id>/', views.DeleteReviewView.as_view(), name='delete_review'),
    path('api/token/', TokenObtainPairView.as_view(), name='api_token_pair'),
    path('api/<str:category>/', views.CategoryPostView.as_view(), name="category_api"),
    path('api/category/all/', views.CategoryAPIView.as_view(), name="All_Category"),
    
]
