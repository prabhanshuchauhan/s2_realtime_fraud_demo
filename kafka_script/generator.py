from __future__ import annotations

import argparse
import csv
import json
import os
import random
import sys
import time
from datetime import datetime, timezone
from math import cos, radians
from pathlib import Path

from faker import Faker
from dotenv import load_dotenv

# ─── ENV ───────────────────────────────────────────────────────────────────────
load_dotenv()

# CLI flags override .env where applicable
cli = argparse.ArgumentParser(description="Generate synthetic ATM data")
cli.add_argument("-n", "--num-events", type=int, default=None,
                help="Stop after N transactions (users are always published once)")
cli.add_argument("--dry-run", action="store_true",
                help="Print/save events instead of sending to Kafka")
cli.add_argument("--outfile", type=Path,
                help="Save newline‑delimited JSON to this file (dry‑run only)")
args = cli.parse_args()

DRY_RUN = args.dry_run or bool(int(os.getenv("DRY_RUN", "0")))

# ─── CONFIG ───────────────────────────────────────────────────────────────────
BROKER       = os.getenv("KAFKA_BROKER", "ec2-34-232-153-191.compute-1.amazonaws.com:9092")
TX_TOPIC     = os.getenv("KAFKA_TOPIC", "atm-transactions")
USERS_TOPIC  = os.getenv("USERS_TOPIC", "atm-users")
CITIES_FILE  = Path(os.getenv("CITIES_FILE", "worldcities.csv"))
NUM_USERS    = int(os.getenv("NUM_USERS", 50))

fake = Faker()

# ─── LOAD CITIES ──────────────────────────────────────────────────────────────
if not CITIES_FILE.exists():
    sys.exit(f"[ERROR] Missing city file: {CITIES_FILE}\n"
             "Download worldcities.csv from https://simplemaps.com/static/demos/resources/world-cities/world_cities.csv")

CITIES: list[dict[str, str]] = []
with CITIES_FILE.open(newline="", encoding="utf-8") as f:
    rdr = csv.DictReader(f)
    for row in rdr:
        try:
            pop = float(row.get("pop", 0))
        except ValueError:
            pop = 0
        if pop >= 50_000:
            CITIES.append(row)

if not CITIES:
    sys.exit("[ERROR] City list empty after filtering.")

# ─── HELPERS ──────────────────────────────────────────────────────────────────

def random_position(lat: float, lon: float, max_km: float = 5.0):
    dlat = (random.random() - 0.5) * max_km / 111.0
    dlon = (random.random() - 0.5) * max_km / (111.0 * cos(radians(lat)))
    return round(lat + dlat, 5), round(lon + dlon, 5)

# ─── USERS ────────────────────────────────────────────────────────────────────
USERS: list[dict[str, str | int | float]] = []
for uid in range(1, NUM_USERS + 1):
    city = random.choice(CITIES)
    USERS.append({
        "user_id": uid,
        "username": fake.user_name(),
        "home_lat": float(city["lat"]),
        "home_lon": float(city["lng"]),
        "city": city["city"],
        "country": city["country"],
    })

# ─── OUTPUT ───────────────────────────────────────────────────────────────────
producer = None
if not DRY_RUN:
    try:
        from kafka import KafkaProducer

        producer = KafkaProducer(
            bootstrap_servers=[BROKER],
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )
        print(f"[Kafka] connected to {BROKER}")
    except Exception as e:
        print(f"[WARN] Kafka unavailable ({e}); switching to dry‑run")
        DRY_RUN = True

outfile = args.outfile.open("w", encoding="utf-8") if args.outfile else None

# ─── PUBLISH USERS ONCE ───────────────────────────────────────────────────────
print("Publishing user roster…")
for u in USERS:
    if DRY_RUN:
        txt = json.dumps(u)
        print(txt)
        if outfile:
            outfile.write(txt + "\n")
    else:
        producer.send(USERS_TOPIC, u)
if producer and not DRY_RUN:
    producer.flush()
print("User roster published. Starting transaction stream…")

# ─── TRANSACTION LOOP ─────────────────────────────────────────────────────────
events_sent = 0
try:
    while True:
        user = random.choice(USERS)
        if random.random() < 0.9:
            lat, lon = random_position(user["home_lat"], user["home_lon"], 5)
        else:
            fraud_city = random.choice(CITIES)
            lat = float(fraud_city["lat"])
            lon = float(fraud_city["lng"])

        tx = {
            "user_id": user["user_id"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "lat": lat,
            "lon": lon,
            "amount": round(random.uniform(20, 500), 2),
            "atm_id": fake.bothify("ATM_##_????"),
        }

        if DRY_RUN:
            txt = json.dumps(tx)
            print(txt)
            if outfile:
                outfile.write(txt + "\n")
        else:
            producer.send(TX_TOPIC, tx)

        events_sent += 1
        if args.num_events and events_sent >= args.num_events:
            break
        time.sleep(random.uniform(0.3, 1.5))
except KeyboardInterrupt:
    print("\nStopped by user.")
finally:
    if outfile:
        outfile.close()
    if producer and not DRY_RUN:
        producer.flush()
[ec2-user@ip-172-31-62-254 ~]$ 
