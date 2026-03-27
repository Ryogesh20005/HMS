from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.utils import timezone
from hospital_app.models import User, Patient, Doctor, Appointment, Billing
from hospital_app.serializers import (
    UserSerializer, LoginSerializer, PatientSerializer, 
    DoctorSerializer, AppointmentSerializer, BillingSerializer
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsDoctor(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'doctor'


class IsPatient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'patient'


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Create corresponding patient or doctor profile
            if user.role == 'patient':
                try:
                    Patient.objects.create(
                        user=user,
                        date_of_birth=request.data.get('date_of_birth'),
                        blood_group=request.data.get('blood_group'),
                        allergies=request.data.get('allergies'),
                        medical_history=request.data.get('medical_history'),
                        emergency_contact=request.data.get('emergency_contact'),
                        emergency_contact_name=request.data.get('emergency_contact_name'),
                    )
                except Exception as e:
                    print(f"Error creating patient profile: {e}")
                    return Response({'error': 'Failed to create patient profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            elif user.role == 'doctor':
                try:
                    Doctor.objects.create(
                        user=user,
                        specialization=request.data.get('specialization', 'general'),
                        license_number=request.data.get('license_number', ''),
                        qualification=request.data.get('qualification', ''),
                        years_of_experience=request.data.get('years_of_experience', 0),
                        consultation_fee=request.data.get('consultation_fee', 500.00)
                    )
                except Exception as e:
                    print(f"Error creating doctor profile: {e}")
                    return Response({'error': 'Failed to create doctor profile'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            refresh = RefreshToken.for_user(user)
            
            user_serializer = UserSerializer(user)
            return Response({
                'user': user_serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['created_at']
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        if self.request.user.role == 'patient':
            return Patient.objects.filter(user=self.request.user)
        elif self.request.user.role == 'doctor':
            # Doctor can see patients they have appointments with
            return Patient.objects.filter(appointments__doctor__user=self.request.user).distinct()
        return Patient.objects.all()
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        if request.user.role == 'patient':
            patient = get_object_or_404(Patient, user=request.user)
            serializer = self.get_serializer(patient)
            return Response(serializer.data)
        return Response({'error': 'Only patients can access this'}, status=status.HTTP_403_FORBIDDEN)


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.filter(is_available=True)
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['specialization', 'is_available']
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    ordering_fields = ['consultation_fee', 'created_at']
    
    def get_queryset(self):
        if self.request.user.role == 'doctor':
            return Doctor.objects.filter(user=self.request.user)
        if self.request.user.role == 'admin':
            return Doctor.objects.all()
        return Doctor.objects.filter(is_available=True)
    
    @action(detail=False, methods=['get'])
    def my_profile(self, request):
        if request.user.role == 'doctor':
            doctor = get_object_or_404(Doctor, user=request.user)
            serializer = self.get_serializer(doctor)
            return Response(serializer.data)
        return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=False, methods=['post'])
    def update_availability(self, request):
        if request.user.role == 'doctor':
            doctor = get_object_or_404(Doctor, user=request.user)
            doctor.is_available = request.data.get('is_available', True)
            doctor.save()
            return Response({'message': 'Availability updated'}, status=status.HTTP_200_OK)
        return Response({'error': 'Only doctors can access this'}, status=status.HTTP_403_FORBIDDEN)


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'appointment_date']
    ordering_fields = ['appointment_date', 'appointment_time']
    
    def get_queryset(self):
        if self.request.user.role == 'patient':
            return Appointment.objects.filter(patient__user=self.request.user)
        elif self.request.user.role == 'doctor':
            return Appointment.objects.filter(doctor__user=self.request.user)
        return Appointment.objects.all()
    
    def create(self, request, *args, **kwargs):
        if request.user.role != 'patient':
            return Response({'error': 'Only patients can book appointments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        try:
            patient = Patient.objects.get(user=request.user)
            request.data['patient'] = patient.id
            return super().create(request, *args, **kwargs)
        except Patient.DoesNotExist:
            return Response({'error': 'Patient profile not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        if appointment.patient.user != request.user and request.user.role != 'admin':
            return Response({'error': 'You cannot cancel this appointment'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        if request.user.role not in ['doctor', 'admin']:
            return Response({'error': 'Only doctors and admins can complete appointments'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        return Response({'message': 'Appointment completed'}, status=status.HTTP_200_OK)


class BillingViewSet(viewsets.ModelViewSet):
    queryset = Billing.objects.all()
    serializer_class = BillingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['payment_status']
    ordering_fields = ['created_at', 'total_amount']
    
    def get_queryset(self):
        if self.request.user.role == 'patient':
            return Billing.objects.filter(appointment__patient__user=self.request.user)
        elif self.request.user.role == 'doctor':
            return Billing.objects.filter(appointment__doctor__user=self.request.user)
        return Billing.objects.all()
    
    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        billing = self.get_object()
        paid_amount = request.data.get('paid_amount', 0)
        payment_method = request.data.get('payment_method', 'cash')
        
        billing.paid_amount += float(paid_amount)
        billing.payment_method = payment_method
        
        if billing.paid_amount >= billing.total_amount:
            billing.payment_status = 'paid'
        else:
            billing.payment_status = 'partially_paid'
        
        billing.payment_date = timezone.now()
        billing.save()
        
        serializer = self.get_serializer(billing)
        return Response(serializer.data, status=status.HTTP_200_OK)
