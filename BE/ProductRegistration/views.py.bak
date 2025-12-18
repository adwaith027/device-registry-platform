from django.db import connection
from rest_framework import status
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Serialdata, Palmteccustomerdetails
from .serializers import DeviceSerializer,SerialNumberDetails,MappingSerializer


@api_view(['GET'])
def get_serial_numbers(request):
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
def get_customer_mappings(request):
    try:
        # Get all parameters from request
        serial_number = request.GET.get('serialNumber', None)
        customer_code = request.GET.get('customerCode', 0)
        customer_name = request.GET.get('customerName', '')
        company = request.GET.get('company', '')  
        device_type = request.GET.get('deviceType', '')  
        from_date = request.GET.get('fromDate', '2020-01-01')
        to_date = request.GET.get('toDate', '2099-12-31')
        approved_status = request.GET.get('approvedStatus', -1)
        search_text = request.GET.get('searchText', '')
        page_number = request.GET.get('pageNumber', 0)
        page_size = request.GET.get('pageSize', 10)
        sort_index = request.GET.get('sortingOrderIndex', 1)  
        sort_direction = request.GET.get('sortingOrderDirection', 0)  
        
        args = [
            serial_number,
            customer_code,
            customer_name,
            company,          
            device_type,      
            from_date,
            to_date,
            approved_status,
            search_text,
            page_number,
            page_size,
            sort_index,
            sort_direction,
            0
        ]
        

        with connection.cursor() as cursor:
            cursor.callproc('get_serial_customer_details', args)
            results = cursor.fetchall()
            
            # Get total count
            cursor.execute("SELECT @_get_serial_customer_details_13")
            total_count = cursor.fetchone()[0]
        
        # Format response
        data = []
        for row in results:
            data.append({
                'upiDeviceSerialNumber': row[0],
                'uniqueIdentifier': row[1],
                'customerCode': row[2],
                'customerName': row[3],
                'company': row[4],
                'devicetype': row[5],
                'isApproved': row[6],
                'createdOn': row[7],
                'modifiedOn': row[8],
                'cLicenseURL': row[9],
                'versionDetails': row[10]
            })
        
        return Response({'status': 'success','data': data,'totalCount': total_count})
        
    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_customer_mapping(request):
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        fieldnames=["serialnumber","uniqueIdentifier","customerCode","customerName","company",
                "devicetype","licenseUrl","versionDetails"]

        form_data=[]
        missing_data=[]
        for fieldname in fieldnames:
            value = request.data.get(fieldname)
            if value is None or not str(value).strip():
                missing_data.append(fieldname)
            else:
                form_data.append(value)

        if missing_data:
            return Response({'status':'error','message':f'Missing values in input,{missing_data}'},status=status.HTTP_400_BAD_REQUEST)

        form_data.extend(["", ""])
        with connection.cursor() as cursor:
            cursor.callproc("save_serial_customer_details",form_data)

            cursor.execute("SELECT @_save_serial_customer_details_8")
            out_status = cursor.fetchone()[0]
            
            cursor.execute("SELECT @_save_serial_customer_details_9")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_201_CREATED)
            
            elif out_status == 'duplicate':
                # Duplicate serial number
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_409_CONFLICT)

            # out_status == 'error'
            else:
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_customer_mapping(request):
    try:
        if not request.data:
            return Response({"message": "Missing input data"}, status=status.HTTP_400_BAD_REQUEST)

        fieldnames = ["serialnumber", "customerCode", "uniqueIdentifier", "customerName", 
              "company", "devicetype", "cLicenseURL", "versionDetails"]

        form_data=[]
        missing_data=[]
        for fieldname in fieldnames:
            value = request.data.get(fieldname)
            if value is None or not str(value).strip():
                missing_data.append(fieldname)
            else:
                form_data.append(value)

        if missing_data:
            return Response({'status':'error','message':f'Missing values in input,{missing_data}'},status=status.HTTP_400_BAD_REQUEST)

        form_data.extend(["", ""])
        with connection.cursor() as cursor:
            cursor.callproc("update_customer_by_serial",form_data)

            cursor.execute("SELECT @_update_customer_by_serial_8")
            out_status = cursor.fetchone()[0]
            
            cursor.execute("SELECT @_update_customer_by_serial_9")
            out_message = cursor.fetchone()[0]

            if out_status == 'success':
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_200_OK)
            
            elif out_status == 'not_found':
                # serial number not found
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_404_NOT_FOUND)

            # out_status == 'error'
            else:
                return Response({"message": out_message,"status": out_status}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_device_details(request):
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

            return Response({'status':"success",'statusCode':200,"message": "Device Details Fetch Succesfully!","data":result})

    except Exception as e:
        return Response({'status': 'error','message': 'Server error occurred','error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)