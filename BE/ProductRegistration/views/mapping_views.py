from django.db import connection
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .auth_views import get_user_from_cookie


@api_view(['GET'])
def get_customer_mappings(request):
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
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
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
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
    # Validate user
    user=get_user_from_cookie(request)
    if not user:
        return Response({
            'error': 'Authentication required'
        }, status=401)
    
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



