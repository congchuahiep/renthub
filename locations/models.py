from django.db import models

# Create your models here.
class AdministrativeRegion(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    code_name_en = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name


class AdministrativeUnit(models.Model):
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    short_name = models.CharField(max_length=255, null=True, blank=True)
    short_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    code_name_en = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.full_name or self.short_name or str(self.id)


class Province(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    administrative_unit = models.ForeignKey(
        AdministrativeUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="provinces"
    )
    administrative_region = models.ForeignKey(
        AdministrativeRegion, on_delete=models.SET_NULL, null=True, blank=True, related_name="provinces"
    )

    def __str__(self):
        return self.name


class District(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, null=True, blank=True, related_name="districts"
    )
    administrative_unit = models.ForeignKey(
        AdministrativeUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="districts"
    )

    def __str__(self):
        return self.name


class Ward(models.Model):
    code = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255, null=True, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=True)
    full_name_en = models.CharField(max_length=255, null=True, blank=True)
    code_name = models.CharField(max_length=255, null=True, blank=True)
    district = models.ForeignKey(
        District, on_delete=models.CASCADE, null=True, blank=True, related_name="wards"
    )
    administrative_unit = models.ForeignKey(
        AdministrativeUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name="wards"
    )

    def __str__(self):
        return self.name