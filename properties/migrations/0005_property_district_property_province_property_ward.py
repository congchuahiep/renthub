# Generated by Django 5.1.7 on 2025-05-03 16:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0001_initial'),
        ('properties', '0004_remove_property_district_remove_property_province_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='district',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.district'),
        ),
        migrations.AddField(
            model_name='property',
            name='province',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.province'),
        ),
        migrations.AddField(
            model_name='property',
            name='ward',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='properties', to='locations.ward'),
        ),
    ]
