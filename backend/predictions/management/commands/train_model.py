# Drug/backend/predictions/management/commands/train_model.py
from django.core.management.base import BaseCommand
from predictions.forecaster import predictor_instance

class Command(BaseCommand):
    help = 'Train the drug shortage prediction ML model'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--samples',
            type=int,
            default=2000,
            help='Number of training samples (if using synthetic data)'
        )
    
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Starting ML model training...'))
        
        try:
            accuracy = predictor_instance.train_model()
            
            self.stdout.write(self.style.SUCCESS(f'✅ Model training completed!'))
            self.stdout.write(self.style.SUCCESS(f'📈 Accuracy: {accuracy:.2%}'))
            self.stdout.write(self.style.SUCCESS(f'💾 Model saved to ml_models/'))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Training failed: {e}'))