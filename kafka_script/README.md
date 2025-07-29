# Kafka Data Generator

This script generates synthetic ATM transaction and user data for the fraud detection demo, publishing to Kafka topics.

## Features
- Generates realistic ATM transactions and user profiles
- Publishes to Kafka topics for real-time ingestion
- Configurable via .env and CLI flags

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```
Dependencies: `faker`, `python-dotenv`, `kafka-python`

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your Kafka and data settings:
```env
KAFKA_BROKER=your-kafka-broker:9092
KAFKA_TOPIC=atm-transactions
USERS_TOPIC=atm-users
CITIES_FILE=worldcities.csv
NUM_USERS=50
DRY_RUN=0
```

### 3. Run the generator
```bash
python generator.py
```

#### CLI Flags
- `-n`, `--num-events`: Stop after N transactions
- `--dry-run`: Print/save events instead of sending to Kafka
- `--outfile`: Save output to file (dry-run only)

## Data
- `worldcities.csv` is required for city data (included)

## License
MIT 