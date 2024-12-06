# Generated by Django 5.1.4 on 2024-12-06 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('player1_username', models.CharField(max_length=150)),
                ('player2_username', models.CharField(max_length=150)),
                ('player1_score', models.IntegerField()),
                ('player2_score', models.IntegerField()),
                ('winner', models.CharField(max_length=150)),
                ('date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('winner', models.CharField(max_length=150)),
                ('date', models.DateTimeField()),
                ('matches', models.JSONField()),
            ],
        ),
    ]
