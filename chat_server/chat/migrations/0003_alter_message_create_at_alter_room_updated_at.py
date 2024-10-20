# Generated by Django 5.1.1 on 2024-10-18 02:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0002_alter_room_created_at_alter_room_is_active_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="message",
            name="create_at",
            field=models.DateTimeField(auto_now_add=True, help_text="时间"),
        ),
        migrations.AlterField(
            model_name="room",
            name="updated_at",
            field=models.DateTimeField(auto_now_add=True, help_text="更新时间"),
        ),
    ]
