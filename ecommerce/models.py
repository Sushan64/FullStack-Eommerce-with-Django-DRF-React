from django.db import models
from django.utils.text import slugify

# Create your models here.
class Category(models.Model):
  CHOICE= {
    "M": 'Male',
    'F': 'Female',
    'T' : 'Tech',
    'E': 'Electronic',
    'G': 'Grocery',
    'C': 'Cloth'
  }
  category = models.CharField(max_length=4, choices=CHOICE)
  
  def __str__(self):
    return self.category

def auto_slug(instance):
  base_slug = slugify(instance.name)
  slug = base_slug
  num = 1
  while Product.objects.filter(slug=slug).exists():
    slug = f"{base_slug}-{num}"
    num+=1
  return slug
  
  

class Product(models.Model):
  name = models.CharField(max_length=100)
  image = models.ImageField(upload_to="image/")
  category = models.ForeignKey(Category, on_delete=models.CASCADE)
  slug = models.CharField(max_length=100, unique=True)
  description= models.TextField()
  free_delivary = models.BooleanField()
  price = models.IntegerField()
  
  def save(self, *arg, **kwarg):
    if not self.slug:
      self.slug = auto_slug(self)
    super().save(*arg, **kwarg)
    
  def __str__(self):
    return self.name