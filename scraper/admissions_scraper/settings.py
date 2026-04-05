# Scrapy settings for admissions_scraper project

BOT_NAME = "admissions_scraper"

SPIDER_MODULES = ["admissions_scraper.spiders"]
NEWSPIDER_MODULE = "admissions_scraper.spiders"

# ─── MongoDB Atlas Connection ───
# Replace with your actual MongoDB Atlas URI
# Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
import os
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/careerplatform')
MONGO_DATABASE = os.getenv('MONGO_DATABASE', 'careerplatform')

# ─── Activate the MongoDB Pipeline ───
ITEM_PIPELINES = {
    "admissions_scraper.pipelines.MongoDBPipeline": 300,
}

# ─── Crawl Settings ───
ROBOTSTXT_OBEY = True
CONCURRENT_REQUESTS = 4
DOWNLOAD_DELAY = 1  # Be polite to government servers

# ─── User Agent ───
USER_AGENT = "CerebroPath-AcademicProject/1.0 (+https://github.com/your-repo)"

# ─── Feed Export (also save to JSON as backup) ───
FEEDS = {
    'output/%(name)s_%(time)s.json': {
        'format': 'json',
        'encoding': 'utf-8',
        'indent': 2,
    },
}

# ─── Logging ───
LOG_LEVEL = 'INFO'

# Set settings whose default value is deprecated to a future-proof value
REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
FEED_EXPORT_ENCODING = "utf-8"
