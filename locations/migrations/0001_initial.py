# Generated by Django 5.1.7 on 2025-05-03 16:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdministrativeRegion',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('name_en', models.CharField(max_length=255)),
                ('code_name', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name_en', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='AdministrativeUnit',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('full_name', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('short_name', models.CharField(blank=True, max_length=255, null=True)),
                ('short_name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name_en', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Province',
            fields=[
                ('code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name', models.CharField(max_length=255)),
                ('full_name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name', models.CharField(blank=True, max_length=255, null=True)),
                ('administrative_region', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='provinces', to='locations.administrativeregion')),
                ('administrative_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='provinces', to='locations.administrativeunit')),
            ],
        ),
        migrations.CreateModel(
            name='District',
            fields=[
                ('code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name', models.CharField(blank=True, max_length=255, null=True)),
                ('administrative_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='districts', to='locations.administrativeunit')),
                ('province', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='districts', to='locations.province')),
            ],
        ),
        migrations.CreateModel(
            name='Ward',
            fields=[
                ('code', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name', models.CharField(blank=True, max_length=255, null=True)),
                ('full_name_en', models.CharField(blank=True, max_length=255, null=True)),
                ('code_name', models.CharField(blank=True, max_length=255, null=True)),
                ('administrative_unit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='wards', to='locations.administrativeunit')),
                ('district', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='wards', to='locations.district')),
            ],
        ),
    ]
