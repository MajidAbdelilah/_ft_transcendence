# Generated by Django 4.2.16 on 2024-11-28 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authapp', '0005_alter_user_is_2fa'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_on',
            field=models.IntegerField(default=0),
        ),
    ]
