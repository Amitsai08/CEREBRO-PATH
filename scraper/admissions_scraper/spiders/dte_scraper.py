import scrapy

class DteSpider(scrapy.Spider):
    name = "dte_diploma"
    start_urls = ["https://dte.maharashtra.gov.in/"]
    
    def parse(self, response):
        """
        Scrapes DTE Maharashtra for Diploma institution data.
        In production, we'd intercept XHR calls or parse PDF merit lists.
        """
        sample_data = [
            {
                "college_name": "Government Polytechnic Mumbai",
                "institute_code": "DP0001",
                "district": "Mumbai",
                "type": "Diploma",
                "courses": [
                    {"course_name": "Computer Engineering", "seat_intake": 60, "previous_cutoff": 92},
                    {"course_name": "Mechanical Engineering", "seat_intake": 60, "previous_cutoff": 85},
                    {"course_name": "Electronics & Telecom", "seat_intake": 40, "previous_cutoff": 80},
                ]
            },
            {
                "college_name": "Government Polytechnic Pune",
                "institute_code": "DP0002",
                "district": "Pune",
                "type": "Diploma",
                "courses": [
                    {"course_name": "Computer Engineering", "seat_intake": 60, "previous_cutoff": 90},
                    {"course_name": "Civil Engineering", "seat_intake": 40, "previous_cutoff": 75},
                ]
            },
            {
                "college_name": "Shri Bhagubhai Mafatlal Polytechnic",
                "institute_code": "DP0045",
                "district": "Mumbai",
                "type": "Diploma",
                "courses": [
                    {"course_name": "Information Technology", "seat_intake": 60, "previous_cutoff": 88},
                    {"course_name": "Electrical Engineering", "seat_intake": 40, "previous_cutoff": 78},
                ]
            },
            {
                "college_name": "Government Polytechnic Nagpur",
                "institute_code": "DP0003",
                "district": "Nagpur",
                "type": "Diploma",
                "courses": [
                    {"course_name": "Computer Engineering", "seat_intake": 40, "previous_cutoff": 82},
                    {"course_name": "Mechanical Engineering", "seat_intake": 60, "previous_cutoff": 70},
                ]
            },
        ]
        
        for college in sample_data:
            yield college
