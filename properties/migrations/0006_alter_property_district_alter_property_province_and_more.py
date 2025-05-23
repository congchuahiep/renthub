# Generated by Django 5.1.7 on 2025-05-19 02:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
        ('properties', '0005_property_district_property_province_property_ward'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='district',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.district'),
        ),
        migrations.AlterField(
            model_name='property',
            name='province',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.province'),
        ),
        migrations.AlterField(
            model_name='property',
            name='ward',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.ward'),
        ),
    ]
