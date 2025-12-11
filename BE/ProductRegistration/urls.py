from django.urls import path
import ProductRegistration.views as views

urlpatterns = [
    path('get_serial_numbers/', views.get_serial_numbers, name="get_serial_numbers"),
    path('add_serial_number/', views.add_serial_number, name="add_serial_number"),
    path('approve_serial_number/', views.approve_serial_number, name="approve_serial_number"),
    path('allocate_serial_number/', views.allocate_serial_number, name="allocate_serial_number"),
    path('getSerialNumber/', views.get_unallocated_sl_no, name="get_unallocated_sl_no"),
]
