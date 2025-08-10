import redis
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Connect to Redis Cloud
r = redis.Redis(
    host=os.getenv('REDIS_URL').split('@')[1].split(':')[0],
    port=int(os.getenv('REDIS_URL').split(':')[-1]),
    password=os.getenv('REDIS_URL').split(':')[2].split('@')[0],
    ssl=True
)

# Load and store the model
def load_model():
    try:
        with open('career_model.pt', 'rb') as f:
            model = f.read()
        
        r.execute_command(
            'AI.MODELSTORE',
            'career_model',  # Model name
            'TORCH',         # Framework
            'CPU',           # Device
            'BLOB',          # Data type
            model
        )
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")

if __name__ == "__main__":
    load_model()