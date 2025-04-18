# Generated by Django 5.1.7 on 2025-04-09 14:20

import cloudinary.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardingHouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('boarding_house_name', models.CharField(max_length=256)),
                ('address', models.CharField(max_length=256)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CommentPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', cloudinary.models.CloudinaryField(max_length=255)),
                ('alt', models.CharField(blank=True, max_length=256, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Utilities',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=256)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('content', models.TextField(max_length=100)),
                ('reply_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='utils.comment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_post', to=settings.AUTH_USER_MODEL)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comment_post', to='utils.commentpost')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('landlord', models.ForeignKey(limit_choices_to={'user_type': 'LR'}, on_delete=django.db.models.deletion.CASCADE, related_name='landlord_convarsation', to=settings.AUTH_USER_MODEL)),
                ('tenent', models.ForeignKey(limit_choices_to={'user_type': 'TN'}, on_delete=django.db.models.deletion.CASCADE, related_name='tenant_convarsation', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ImageRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('object_id', models.PositiveIntegerField()),
                ('generic_model', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
                ('image', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='relations', to='utils.image')),
            ],
            options={
                'db_table': 'image_relation',
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('content', models.TextField()),
                ('composation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='utils.conversation')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RoomSeekingPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=256)),
                ('content', models.TextField(null=True)),
                ('status', models.CharField(choices=[('pd', 'Đang kiểm duyệt'), ('ap', 'Đã kiểm duyệt'), ('rj', 'Từ chối kiểm duyệt'), ('ep', 'Hết hạn'), ('rt', 'Đã thuê')], default='pd', max_length=10)),
                ('position', models.CharField(max_length=20)),
                ('area', models.FloatField()),
                ('limit_person', models.IntegerField()),
                ('comment_post', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='utils.commentpost')),
                ('tenent', models.ForeignKey(limit_choices_to={'user_type': 'TN'}, on_delete=django.db.models.deletion.CASCADE, related_name='room_seeking_post', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_date'],
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RentalPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(max_length=256)),
                ('content', models.TextField(null=True)),
                ('status', models.CharField(choices=[('pd', 'Đang kiểm duyệt'), ('ap', 'Đã kiểm duyệt'), ('rj', 'Từ chối kiểm duyệt'), ('ep', 'Hết hạn'), ('rt', 'Đã thuê')], default='pd', max_length=10)),
                ('province', models.CharField(max_length=256)),
                ('city', models.CharField(max_length=256)),
                ('address', models.CharField(max_length=256)),
                ('price', models.FloatField(blank=True, null=True)),
                ('limit_person', models.IntegerField(blank=True, null=True)),
                ('area', models.FloatField()),
                ('number_of_bedrooms', models.IntegerField(blank=True, null=True)),
                ('number_of_bathrooms', models.IntegerField(blank=True, null=True)),
                ('comment_post', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='utils.commentpost')),
                ('landlord', models.ForeignKey(limit_choices_to={'user_type': 'LR'}, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('utilities', models.ManyToManyField(blank=True, related_name='rental_posts', to='utils.utilities')),
            ],
            options={
                'ordering': ['-created_date'],
                'abstract': False,
            },
        ),
    ]
