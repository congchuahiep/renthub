# Generated by Django 5.1.7 on 2025-04-04 11:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rentalpost',
            name='limit_person',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rentalpost',
            name='number_of_bathrooms',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rentalpost',
            name='number_of_bedrooms',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rentalpost',
            name='price',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='rentalpost',
            name='utilities',
            field=models.ManyToManyField(blank=True, null=True, related_name='rental_posts', to='core.utilities'),
        ),
    ]
