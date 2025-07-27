import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from ecommerce.models import Cart, CartItems, Product
import requests

# Create test user
user, created = User.objects.get_or_create(username='testuser', defaults={'email': 'test@test.com'})
if created:
    user.set_password('testpass123')
    user.save()

# Create or get token
token, created = Token.objects.get_or_create(user=user)
print(f"Token: {token.key}")

# Create test cart and cart item
cart, _ = Cart.objects.get_or_create(user=user)

# Check if we have products
products = Product.objects.all()
if products.exists():
    product = products.first()
    cart_item, _ = CartItems.objects.get_or_create(cart=cart, product=product)
    print(f"Created cart item with ID: {cart_item.id}")
    
    # Test deletion
    url = f"http://localhost:3000/api/cart/delete/{cart_item.id}/"
    headers = {"Authorization": f"Token {token.key}"}
    
    response = requests.delete(url, headers=headers)
    print(f"Delete response: {response.status_code} - {response.text}")
else:
    print("No products found. Please create a product first.")