from rest_framework import serializers
from .models import Serialdata,Palmteccustomerdetails
import re


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Serialdata
        fields = ['serialnumber'] 

    def validate_serialnumber(self,value):
        
        pattern = "^[0-9]{4}[0-9]{2}(AMP|API)[0-9]{6}B$"

        if not re.fullmatch(pattern=pattern, string=value):
            raise serializers.ValidationError("Serial number not following pattern")
        return value
    
class SerialNumberDetails(serializers.ModelSerializer):
    class Meta:
        model = Serialdata
        fields = ['serialnumber','deviceid','imei','imsi','isapproved','isallocated','createdate']


class MappingSerializer(serializers.ModelSerializer):
    class Meta:
        model=Palmteccustomerdetails
        fields=['upideviceserialnumber','uniqueidentifier','customercode','customername','clicenseurl','versiondetails','devicetype','company']