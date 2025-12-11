from django.db import models


class PalmtecUpiDetails(models.Model):
    upideviceserialnumber = models.CharField(db_column='upiDeviceSerialNumber', primary_key=True, max_length=24)
    uniqueidentifier = models.CharField(db_column='uniqueIdentifier', max_length=24, blank=True, null=True)
    customercode = models.BigIntegerField(db_column='customerCode')
    customername = models.CharField(db_column='customerName', max_length=128, blank=True, null=True)
    isapproved = models.IntegerField(db_column='isApproved', blank=True, null=True)
    isdeleted = models.IntegerField(db_column='isDeleted', blank=True, null=True)
    createdon = models.DateTimeField(db_column='createdOn', blank=True, null=True)
    modifiedon = models.DateTimeField(db_column='modifiedOn', blank=True, null=True)
    clicenseurl = models.CharField(db_column='cLicenseURL', max_length=255, blank=True, null=True)
    versiondetails = models.CharField(db_column='versionDetails', max_length=12, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'palmtec_upi_details'


class Serialdata(models.Model):
    serialnumber = models.CharField(db_column='serialNumber', primary_key=True, max_length=18)
    isapproved = models.IntegerField(db_column='isApproved', blank=True, null=True)
    isallocated = models.IntegerField(db_column='isAllocated', blank=True, null=True)
    createdate = models.DateTimeField(db_column='createDate', blank=True, null=True)
    modifieddate = models.DateTimeField(db_column='modifiedDate', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'serialdata'
