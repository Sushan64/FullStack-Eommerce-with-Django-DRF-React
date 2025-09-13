from django.contrib import admin
from django.contrib.auth import get_user_model
from .models import Product, Attribute, AttributeValue, Category

User = get_user_model()
# Register your models here.
admin.site.register(User)
admin.site.register(Product)
admin.site.register(Attribute)
admin.site.register(AttributeValue)
admin.site.register(Category)
