"""
Scrapy Pipeline to push scraped college data directly into MongoDB Atlas.
This pipeline is activated in settings.py and runs for every item yielded by any spider.
"""
import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDBPipeline:
    """
    Stores scraped items into MongoDB Atlas.
    Handles deduplication by institute_code (upsert).
    """

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        """Read MongoDB connection details from Scrapy settings or environment."""
        return cls(
            mongo_uri=crawler.settings.get('MONGO_URI', os.getenv('MONGO_URI', '')),
            mongo_db=crawler.settings.get('MONGO_DATABASE', os.getenv('MONGO_DATABASE', 'careerplatform'))
        )

    def open_spider(self, spider):
        """Connect to MongoDB when any spider starts."""
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]
        self.collection = self.db['colleges']
        spider.logger.info(f"✅ Connected to MongoDB: {self.mongo_db}")

    def close_spider(self, spider):
        """Close MongoDB connection when spider finishes."""
        self.client.close()
        spider.logger.info("🔌 MongoDB connection closed")

    def process_item(self, item, spider):
        """
        Upsert each college record into MongoDB.
        Uses institute_code as the unique identifier to avoid duplicates.
        """
        try:
            self.collection.update_one(
                {'institute_code': item.get('institute_code')},  # Filter: find by code
                {'$set': dict(item)},                             # Update: set all fields
                upsert=True                                       # Insert if not found
            )
            spider.logger.info(f"📦 Saved: {item.get('college_name', 'Unknown')}")
        except Exception as e:
            spider.logger.error(f"❌ Error saving to MongoDB: {e}")
        
        return item
