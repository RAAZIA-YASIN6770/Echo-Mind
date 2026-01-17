from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='KnowledgeTree',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('health_score', models.IntegerField(default=50)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='knowledge_tree', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TreeNode',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('concept_id', models.CharField(db_index=True, max_length=200)),
                ('title', models.CharField(max_length=255)),
                ('mastered', models.BooleanField(default=False)),
                ('mastery_confidence', models.FloatField(default=0.0)),
                ('last_practiced', models.DateTimeField(blank=True, null=True)),
                ('tree', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='nodes', to='gamification.knowledgetree')),
            ],
            options={
                'unique_together': {('tree', 'concept_id')},
            },
        ),
        migrations.CreateModel(
            name='Streak',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('current_streak', models.IntegerField(default=0)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('best_streak', models.IntegerField(default=0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='streak', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BadgeDefinition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(unique=True, max_length=100)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserBadge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('earned_at', models.DateTimeField(auto_now_add=True)),
                ('badge', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='gamification.badgedefinition')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='badges', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'badge')},
            },
        ),
        migrations.CreateModel(
            name='OfflineChallenge',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('template_key', models.CharField(unique=True, max_length=100)),
                ('text', models.TextField()),
                ('duration_minutes', models.IntegerField(default=5)),
            ],
        ),
    ]
