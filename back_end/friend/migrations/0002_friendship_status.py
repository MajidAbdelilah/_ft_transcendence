# Generated by Django 4.2.16 on 2024-12-02 19:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('friend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='friendship',
            name='status',
            field=models.CharField(default='pending', max_length=50),
        ),
    ]
