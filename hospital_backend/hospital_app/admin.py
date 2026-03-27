from django.contrib import admin
from hospital_app.models import User, Patient, Doctor, Appointment, Billing


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'first_name', 'last_name', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['username', 'email']
    ordering = ['-created_at']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_name', 'blood_group', 'created_at']
    list_filter = ['blood_group', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_name(self, obj):
        return obj.user.get_full_name()
    get_name.short_description = 'Name'


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_name', 'specialization', 'is_available', 'created_at']
    list_filter = ['specialization', 'is_available', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_name(self, obj):
        return f"Dr. {obj.user.get_full_name()}"
    get_name.short_description = 'Doctor'


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_patient', 'get_doctor', 'appointment_date', 'status']
    list_filter = ['status', 'appointment_date']
    search_fields = ['patient__user__first_name', 'doctor__user__first_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_patient(self, obj):
        return obj.patient.user.get_full_name()
    get_patient.short_description = 'Patient'
    
    def get_doctor(self, obj):
        return f"Dr. {obj.doctor.user.get_full_name()}"
    get_doctor.short_description = 'Doctor'


@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_patient', 'total_amount', 'paid_amount', 'payment_status']
    list_filter = ['payment_status', 'created_at']
    search_fields = ['appointment__patient__user__first_name']
    readonly_fields = ['created_at', 'updated_at', 'total_amount', 'balance']
    
    def get_patient(self, obj):
        return obj.appointment.patient.user.get_full_name()
    get_patient.short_description = 'Patient'
