from rest_framework import serializers
from django.contrib.auth import authenticate
from hospital_app.models import User, Patient, Doctor, Appointment, Billing


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 
                 'role', 'phone', 'profile_picture', 'address', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(username=data.get('username'), password=data.get('password'))
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data


class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Patient
        fields = ['id', 'user', 'user_id', 'date_of_birth', 'blood_group', 
                 'allergies', 'medical_history', 'emergency_contact', 
                 'emergency_contact_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        if user_id:
            validated_data['user_id'] = user_id
        return super().create(validated_data)


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Doctor
        fields = ['id', 'user', 'user_id', 'specialization', 'license_number', 
                 'qualification', 'years_of_experience', 'consultation_fee', 
                 'clinic_address', 'available_time_start', 'available_time_end', 
                 'is_available', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        if user_id:
            validated_data['user_id'] = user_id
        return super().create(validated_data)


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.user.get_full_name', read_only=True)
    doctor_specialization = serializers.CharField(source='doctor.get_specialization_display', read_only=True)
    consultation_fee = serializers.DecimalField(source='doctor.consultation_fee', read_only=True, max_digits=8, decimal_places=2)
    
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'patient_name', 'doctor', 'doctor_name', 
                 'doctor_specialization', 'consultation_fee', 'appointment_date', 
                 'appointment_time', 'status', 'reason', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BillingSerializer(serializers.ModelSerializer):
    appointment_details = AppointmentSerializer(source='appointment', read_only=True)
    
    class Meta:
        model = Billing
        fields = ['id', 'appointment', 'appointment_details', 'consultation_fee', 
                 'medicine_cost', 'test_cost', 'other_charges', 'total_amount', 
                 'paid_amount', 'balance', 'payment_status', 'payment_method', 
                 'payment_date', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['id', 'total_amount', 'balance', 'created_at', 'updated_at']
