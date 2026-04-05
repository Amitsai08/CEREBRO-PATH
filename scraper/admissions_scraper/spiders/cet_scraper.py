import scrapy
import json

class CetSpider(scrapy.Spider):
    name = "cet_engineering"
    # Placeholder URLs - we'd replace this with the actual CET Cell merit list API or HTML
    start_urls = ["https://cetcell.mahacet.org/"] 
    
    def parse(self, response):
        """
        Since government sites rely heavily on PDFs or dynamic JS tables, 
        a real-world implementation usually involves intercepting API XHR calls.
        For demonstration, we scrape generic table rows if present,
        or simulate yielding structured Dicts that will be exported to JSON/MongoDB.
        """
        
        # Simulated logic where we extract from a known table structure:
        # for row in response.css('table.college-list tbody tr'):
        #     yield {
        #         "college_name": row.css('td:nth-child(2)::text').get(),
        #         "institute_code": row.css('td:nth-child(1)::text').get(),
        #         "district": row.css('td:nth-child(3)::text').get(),
        #         "course_name": row.css('td:nth-child(4)::text').get(),
        #         "seat_intake": row.css('td:nth-child(5)::text').get(),
        #         "previous_cutoff": row.css('td:nth-child(6)::text').get(),
        #         "type": "Engineering"
        #     }

        # For the sake of the project running end-to-end, we yield sample records
        # assuming the XHR payload was successfully parsed.
        
        sample_data = [
            {
                 "college_name": "College of Engineering Pune (COEP)",
                 "institute_code": "EN6006",
                 "district": "Pune",
                 "type": "Engineering",
                 "courses": [
                     {"course_name": "Computer Engineering", "seat_intake": 120, "previous_cutoff": 99.8},
                     {"course_name": "Mechanical Engineering", "seat_intake": 120, "previous_cutoff": 98.5}
                 ]
            },
            {
                 "college_name": "Veermata Jijabai Technological Institute (VJTI)",
                 "institute_code": "EN3012",
                 "district": "Mumbai",
                 "type": "Engineering",
                 "courses": [
                     {"course_name": "Computer Engineering", "seat_intake": 60, "previous_cutoff": 99.9},
                     {"course_name": "Information Technology", "seat_intake": 60, "previous_cutoff": 99.5}
                 ]
            }
        ]
        
        for college in sample_data:
            yield college
