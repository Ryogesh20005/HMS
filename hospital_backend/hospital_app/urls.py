from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hospital_app.views import (
    RegisterView, LoginView, LogoutView, UserViewSet,
    PatientViewSet, DoctorViewSet, AppointmentViewSet, BillingViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'billings', BillingViewSet, basename='billing')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('', include(router.urls)),
]
