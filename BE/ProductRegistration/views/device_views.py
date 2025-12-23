from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import Serialdata
from ..serializers import DeviceSerializer,SerialNumberDetails
from django.contrib.auth import get_user_model
from .auth_views import get_user_from_cookie
import datetime


@api_view(['GET'])
def get_serial_numbers(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)

    try:
        data=Serialdata.objects.all()
        serialized_data=SerialNumberDetails(data,many=True).data
        sorted_serial_data = sorted(serialized_data, key=lambda x: x.get("createdate") or "")

        for serial_data in sorted_serial_data:
            serial_data.pop("createdate")

        return Response({"message": "Serial numbers retrived successfully","data":sorted_serial_data})

    except Exception as e:
        # Handle unexpected server errors
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
def get_unallocated_sl_no(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        with connection.cursor() as cursor:
            cursor.callproc("get_single_unallocated_approved_serial",["","",""])

            cursor.execute("SELECT @_get_single_unallocated_approved_serial_0")
            serialnumber=cursor.fetchone()[0]

            cursor.execute("SELECT @_get_single_unallocated_approved_serial_1")
            msg_status=cursor.fetchone()[0]

            cursor.execute("SELECT @_get_single_unallocated_approved_serial_2")
            message=cursor.fetchone()[0]

            if not serialnumber:        
                return Response({"status":msg_status,"message": message}, status=status.HTTP_404_NOT_FOUND)

            isallocated = 1

            # IN parameter
            cursor.callproc("update_serial_number_allocate", [serialnumber,isallocated, "", ""])

            # OUT parameters (index starts from 0 so after 2(0,1) input outputs reside in 2 and 3)
            cursor.execute("SELECT @_update_serial_number_allocate_2")
            out_status = cursor.fetchone()[0]

            cursor.execute("SELECT @_update_serial_number_allocate_3")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"serialnumber":serialnumber,"message": out_message,"status": out_status}, status=status.HTTP_200_OK)

            # not known serial number
            elif out_status == 'not_found':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_404_NOT_FOUND)

            # General error
            else:  # out_status == 'error'
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)

    # Handle unexpected server errors
    except Exception as e:
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['POST'])
def add_serial_number(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DeviceSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Return validation errors with 400 status
            return Response({"message": "Validation error","errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        sl_no = serializer.validated_data['serialnumber']
        category='UPIPLUS'
        
        with connection.cursor() as cursor:
            
            # IN parameter
            cursor.callproc("save_serial_number", [sl_no,category, "", ""])
            
            # OUT parameters
            cursor.execute("SELECT @_save_serial_number_2")
            out_status = cursor.fetchone()[0]
            
            cursor.execute("SELECT @_save_serial_number_3")
            out_message = cursor.fetchone()[0]

        if out_status == 'success':
            return Response({"message": out_message,"status": out_status}, status=status.HTTP_201_CREATED)
        
        elif out_status == 'duplicate':
            # Duplicate serial number
            return Response({"message": out_message,"status": out_status}, status=status.HTTP_409_CONFLICT)
        
        else:  # out_status == 'error'
            # General error from stored procedure
            return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        # Handle unexpected server errors
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PATCH'])
def approve_serial_number(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        serialnumber = request.data.get("serialnumber")
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)

        isapproved = 1
        with connection.cursor() as cursor:
            # IN parameter
            cursor.callproc("update_serial_number_approval", [serialnumber,isapproved, "", ""])

            # OUT parameters (index starts from 0 so after 2(0,1) input outputs reside in 2 and 3)
            cursor.execute("SELECT @_update_serial_number_approval_2")
            out_status = cursor.fetchone()[0]

            cursor.execute("SELECT @_update_serial_number_approval_3")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_200_OK)
        
            elif out_status == 'not_found':
                # not known serial number
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_404_NOT_FOUND)
            
            else:  # out_status == 'error'
                # General error from stored procedure
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)


    except Exception as e:
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def allocate_serial_number(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        serialnumber = request.data.get("serialnumber")
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)

        isallocated = 2
        with connection.cursor() as cursor:
            # IN parameter
            cursor.callproc("update_serial_number_allocate", [serialnumber,isallocated, "", ""])

            # OUT parameters (index starts from 0 so after 2(0,1) input outputs reside in 2 and 3)
            cursor.execute("SELECT @_update_serial_number_allocate_2")
            out_status = cursor.fetchone()[0]

            cursor.execute("SELECT @_update_serial_number_allocate_3")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_200_OK)
        
            elif out_status == 'not_found':
                # not known serial number
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_404_NOT_FOUND)
            
            else:  # out_status == 'error'
                # General error from stored procedure
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)


    except Exception as e:
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def add_upi_pro_serial(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)
        
        serialnumber=request.data.get('serialnumber')
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)

        category='UPIPRO'
        isapproved = 1
        isallocated = 2

        with connection.cursor() as cursor:
            cursor.callproc("save_upi_pro_serial_number", [serialnumber,category,isapproved,isallocated, "", ""])

            cursor.execute("SELECT @_save_upi_pro_serial_number_4")
            out_status = cursor.fetchone()[0]
            
            cursor.execute("SELECT @_save_upi_pro_serial_number_5")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_201_CREATED)
            
            elif out_status == 'duplicate':
                # Duplicate serial number
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_409_CONFLICT)
            
            else:  # out_status == 'error'
                # General error from stored procedure
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        # Handle unexpected server errors
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
def get_device_details(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        serialnumber=request.GET.get('serialnumber')
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.callproc("get_device_details_by_serial",[serialnumber,])

            response=cursor.fetchone()
            if not response:
                return Response({'status':"error",'statusCode':404,"message": "Device Details Fetch Unsuccessful!","data":{}})

            fieldnames=[field[0]for field in cursor.description]

            result=dict(zip(fieldnames, response))
            now = datetime.datetime.now()

            current_date=datetime.datetime.strftime(now.date(),"%d %m %Y")
            current_time_obj=now.time()
            current_time=current_time_obj.strftime("%H:%M:%S")
            
            result.update({"date":current_date,"time":current_time})

            return Response({'status':"success",'statusCode':200,"message": "Device Details Fetch Succesfully!","data":result})

    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(["POST"])
def deactivate_serial_number(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)
        
        serialnumber=request.data.get('serialnumber')
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        with connection.cursor() as cursor:
            cursor.callproc('deactivate_serial_number',[serialnumber,"",""])

            cursor.execute("SELECT @_deactivate_serial_number_1")
            out_status=cursor.fetchone()[0]

            cursor.execute("SELECT @_deactivate_serial_number_2")
            out_message=cursor.fetchone()[0]

            if out_status == "success":
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_200_OK)
            
            elif out_status == "denied":
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_403_FORBIDDEN)
    
            elif out_status == "not_found":
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_404_NOT_FOUND)

            else:  # out_status == 'error'
                # General error from stored procedure
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)

    
    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)