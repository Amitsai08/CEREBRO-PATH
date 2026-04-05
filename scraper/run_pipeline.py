"""
All-in-one Scrape → Clean → Store Pipeline Runner

Usage:
  python run_pipeline.py                   # Run all spiders
  python run_pipeline.py --spider cet      # Run one spider
  python run_pipeline.py --seed-only       # Only seed from JSON files
  python run_pipeline.py --clean-only      # Only clean existing data

Prerequisites:
  pip install -r requirements.txt
  Edit .env with your MongoDB Atlas URI
"""

import subprocess
import sys
import os
import json
import glob
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/careerplatform')
MONGO_DB = os.getenv('MONGO_DATABASE', 'careerplatform')

SPIDERS = {
    'cet': 'cet_engineering',
    'pharmacy': 'cet_pharmacy',
    'medical': 'cet_medical',
    'arts': 'cet_arts_commerce',
    'dte': 'dte_diploma',
    'fyjc': 'fyjc_admission',
}


def check_mongo_connection():
    """Test MongoDB Atlas connection before proceeding."""
    try:
        from pymongo import MongoClient
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()  # Forces a connection
        db = client[MONGO_DB]
        count = db['colleges'].count_documents({})
        print(f"✅ MongoDB connected: {MONGO_DB}")
        print(f"   Current documents in 'colleges': {count}")
        client.close()
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print(f"   URI: {MONGO_URI[:30]}...")
        print(f"\n💡 Fix: Update MONGO_URI in scraper/.env with your Atlas URI")
        print(f"   Format: mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/")
        return False


def run_spider(spider_name):
    """Run a single Scrapy spider."""
    print(f"\n{'='*60}")
    print(f"🕷️  Running spider: {spider_name}")
    print(f"{'='*60}")
    
    result = subprocess.run(
        [sys.executable, '-m', 'scrapy', 'crawl', spider_name,
         '-s', f'MONGO_URI={MONGO_URI}',
         '-s', f'MONGO_DATABASE={MONGO_DB}'],
        cwd=os.path.dirname(os.path.abspath(__file__)),
        capture_output=False
    )
    
    if result.returncode == 0:
        print(f"✅ Spider {spider_name} completed successfully")
    else:
        print(f"⚠️  Spider {spider_name} finished with warnings (code {result.returncode})")
    
    return result.returncode


def clean_data():
    """Run the data cleaning script on all output JSON files."""
    print(f"\n{'='*60}")
    print(f"🧹 Cleaning scraped data")
    print(f"{'='*60}")
    
    json_files = glob.glob('output/*.json')
    if not json_files:
        print("No JSON output files found. Run spiders first.")
        return
    
    # Merge all JSON files
    all_data = []
    for jf in json_files:
        try:
            with open(jf, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if isinstance(data, list):
                    all_data.extend(data)
                else:
                    all_data.append(data)
            print(f"  📄 Loaded {jf}: {len(data) if isinstance(data, list) else 1} records")
        except Exception as e:
            print(f"  ⚠️  Error reading {jf}: {e}")
    
    # Save merged raw data
    with open('output/colleges_merged.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
    print(f"  📦 Merged {len(all_data)} total records → output/colleges_merged.json")
    
    # Run cleaning script
    from clean_data import clean_colleges
    clean_colleges('output/colleges_merged.json', 'output/colleges_cleaned.json')


def seed_from_json():
    """Seed MongoDB Atlas from cleaned JSON file."""
    print(f"\n{'='*60}")
    print(f"🌱 Seeding MongoDB from JSON")
    print(f"{'='*60}")
    
    json_path = 'output/colleges_cleaned.json'
    if not os.path.exists(json_path):
        # Try merged file
        json_path = 'output/colleges_merged.json'
    if not os.path.exists(json_path):
        # Try any JSON
        files = glob.glob('output/*.json')
        if files:
            json_path = files[0]
        else:
            print("❌ No JSON files found. Run spiders first.")
            return
    
    from pymongo import MongoClient
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    collection = db['colleges']
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if not isinstance(data, list):
        data = [data]
    
    inserted = 0
    updated = 0
    for record in data:
        code = record.get('institute_code')
        if not code:
            continue
        result = collection.update_one(
            {'institute_code': code},
            {'$set': record},
            upsert=True
        )
        if result.upserted_id:
            inserted += 1
        elif result.modified_count:
            updated += 1
    
    total = collection.count_documents({})
    print(f"✅ Seeding complete: {inserted} inserted, {updated} updated")
    print(f"   Total documents in 'colleges': {total}")
    client.close()


def show_stats():
    """Show database statistics."""
    from pymongo import MongoClient
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB]
    
    colleges = db['colleges']
    total = colleges.count_documents({})
    
    print(f"\n{'='*60}")
    print(f"📊 Database Statistics")
    print(f"{'='*60}")
    print(f"  Total colleges: {total}")
    
    # Count by type
    pipeline = [{'$group': {'_id': '$type', 'count': {'$sum': 1}}}]
    for group in colleges.aggregate(pipeline):
        print(f"  {group['_id']}: {group['count']}")
    
    # Count by district (top 5)
    pipeline = [
        {'$group': {'_id': '$district', 'count': {'$sum': 1}}},
        {'$sort': {'count': -1}},
        {'$limit': 5}
    ]
    print(f"\n  Top 5 districts:")
    for group in colleges.aggregate(pipeline):
        print(f"    {group['_id']}: {group['count']}")
    
    client.close()


if __name__ == '__main__':
    print("🎓 Cerebro Path — Data Pipeline Runner")
    print(f"   MongoDB: {MONGO_URI[:40]}...")
    print(f"   Database: {MONGO_DB}")
    print()
    
    # Check MongoDB connection
    if not check_mongo_connection():
        sys.exit(1)
    
    # Create output directory
    os.makedirs('output', exist_ok=True)
    
    args = sys.argv[1:]
    
    if '--seed-only' in args:
        seed_from_json()
        show_stats()
    elif '--clean-only' in args:
        clean_data()
    elif '--spider' in args:
        idx = args.index('--spider')
        if idx + 1 < len(args):
            spider_key = args[idx + 1]
            spider_name = SPIDERS.get(spider_key, spider_key)
            run_spider(spider_name)
        else:
            print("Usage: python run_pipeline.py --spider [cet|dte|fyjc]")
    else:
        # Run full pipeline: all spiders → clean → seed
        print("🚀 Running FULL PIPELINE: Scrape → Clean → Store\n")
        
        for key, spider_name in SPIDERS.items():
            run_spider(spider_name)
        
        clean_data()
        seed_from_json()
        show_stats()
        
        print(f"\n{'='*60}")
        print("🎉 Pipeline complete! Data is now in MongoDB Atlas.")
        print(f"{'='*60}")
