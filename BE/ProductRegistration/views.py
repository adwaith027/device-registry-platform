from django.db import connection
from rest_framework import status
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import DeviceSerializer,SerialNumberDetails
from .models import Serialdata, PalmtecUpiDetails


@api_view(['GET'])
def get_serial_numbers(request):
    try:
        data=Serialdata.objects.all()
        serialized_data=SerialNumberDetails(data,many=True).data
        return Response({"message": "Serial numbers retrived successfully","data":serialized_data})
        
    except Exception as e:
        # Handle unexpected server errors
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_unallocated_sl_no(request):
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
                return Response({"status":msg_status,"message": message}, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({"serialnumber":serialnumber,"status":msg_status,"message":message})

    # Handle unexpected server errors
    except Exception as e:
        return Response({"message": "Server error occurred","error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    



@api_view(['POST'])
def add_serial_number(request):
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = DeviceSerializer(data=request.data)
        
        if not serializer.is_valid():
            # Return validation errors with 400 status
            return Response({"message": "Validation error","errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        sl_no = serializer.validated_data['serialnumber']
        
        with connection.cursor() as cursor:
            
            # IN parameter
            cursor.callproc("save_serial_number", [sl_no, "", ""])
            
            # OUT parameters
            cursor.execute("SELECT @_save_serial_number_1")
            out_status = cursor.fetchone()[0]
            
            cursor.execute("SELECT @_save_serial_number_2")
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



@api_view(['PATCH'])
def allocate_serial_number(request):
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        serialnumber = request.data.get("serialnumber")
        if not serialnumber:
            return Response({"message": "Serial number is required"}, status=status.HTTP_400_BAD_REQUEST)

        isallocated = 1
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



@api_view(['DELETE'])
def delete_serial_number(request):
    pass