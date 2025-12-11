from django.contrib import admin
from django.urls import path,include


urlpatterns = [
    path('products/', include('ProductRegistration.urls')),
]
