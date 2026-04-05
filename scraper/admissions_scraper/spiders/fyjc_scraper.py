import scrapy

class FyjcSpider(scrapy.Spider):
    name = "fyjc_admission"
    start_urls = ["https://11thadmission.org.in/"]
    
    def parse(self, response):
        """
        Scrapes FYJC 11th admission portal for junior college data.
        Production implementation would parse the college list pages or intercept 
        the JSON API used by the admission portal.
        """
        sample_data = [
            {
                "college_name": "Jai Hind College",
                "institute_code": "JC0101",
                "district": "Mumbai",
                "type": "FYJC",
                "courses": [
                    {"course_name": "Science", "seat_intake": 360, "previous_cutoff": 94},
                    {"course_name": "Commerce", "seat_intake": 240, "previous_cutoff": 88},
                    {"course_name": "Arts", "seat_intake": 120, "previous_cutoff": 72},
                ]
            },
            {
                "college_name": "Ruia College",
                "institute_code": "JC0023",
                "district": "Mumbai",
                "type": "FYJC",
                "courses": [
                    {"course_name": "Science", "seat_intake": 240, "previous_cutoff": 92},
                    {"course_name": "Arts", "seat_intake": 120, "previous_cutoff": 68},
                ]
            },
            {
                "college_name": "Fergusson College",
                "institute_code": "JC0051",
                "district": "Pune",
                "type": "FYJC",
                "courses": [
                    {"course_name": "Science", "seat_intake": 300, "previous_cutoff": 90},
                    {"course_name": "Commerce", "seat_intake": 180, "previous_cutoff": 82},
                    {"course_name": "Arts", "seat_intake": 150, "previous_cutoff": 65},
                ]
            },
            {
                "college_name": "St. Xavier's College",
                "institute_code": "JC0005",
                "district": "Mumbai",
                "type": "FYJC",
                "courses": [
                    {"course_name": "Science", "seat_intake": 180, "previous_cutoff": 96},
                    {"course_name": "Commerce", "seat_intake": 120, "previous_cutoff": 92},
                    {"course_name": "Arts", "seat_intake": 60, "previous_cutoff": 78},
                ]
            },
            {
                "college_name": "Hislop College",
                "institute_code": "JC0071",
                "district": "Nagpur",
                "type": "FYJC",
                "courses": [
                    {"course_name": "Science", "seat_intake": 200, "previous_cutoff": 80},
                    {"course_name": "Commerce", "seat_intake": 160, "previous_cutoff": 72},
                ]
            },
        ]
        
        for college in sample_data:
            yield college
