# Scheduled Fraud Detection Job

This Jupyter notebook implements the scheduled fraud detection logic for the demo, designed to run as a SingleStore Helios scheduled job.

## Features
- Detects suspicious ATM transactions based on speed/geography
- Inserts potential frauds into the database
- Updates processing metadata

## Requirements
- Python 3.x
- pandas, sqlalchemy
- SingleStore database with the provided schema

## Usage
1. Upload the notebook to your SingleStore Helios environment.
2. Ensure the `connection_url` variable is set (provided by Helios).
3. Run all cells to process new transactions and update fraud results.

## License
MIT 