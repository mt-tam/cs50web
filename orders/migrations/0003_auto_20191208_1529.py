# Generated by Django 2.2.7 on 2019-12-08 15:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_auto_20191208_1525'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='topping',
            name='type',
        ),
        migrations.AddField(
            model_name='product',
            name='topping_included',
            field=models.BooleanField(default=False),
        ),
    ]