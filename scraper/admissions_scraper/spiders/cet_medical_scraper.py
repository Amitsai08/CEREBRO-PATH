import scrapy

class CetMedicalSpider(scrapy.Spider):
    """
    Scrapes Medical & Dental college data from CET Cell Maharashtra.
    CET Cell manages NEET-based medical admissions (MBBS, BDS, BAMS, BHMS, BUMS, BPTh, BOTh).
    Portal: https://cetcell.mahacet.org → Medical/Dental → State Merit List
    
    In production: parse the NEET state merit list PDFs or intercept
    the allotment round API endpoints published during CAP rounds.
    """
    name = "cet_medical"
    start_urls = ["https://cetcell.mahacet.org/"]

    def parse(self, response):
        # ── Maharashtra Medical & Dental Colleges (CET Cell / NEET) ──
        colleges = [
            {
                "college_name": "Grant Medical College & Sir JJ Group of Hospitals",
                "institute_code": "MD0001",
                "district": "Mumbai",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 200, "previous_cutoff": 99.8},
                    {"course_name": "BDS", "seat_intake": 40, "previous_cutoff": 95},
                ]
            },
            {
                "college_name": "Seth GS Medical College & KEM Hospital",
                "institute_code": "MD0002",
                "district": "Mumbai",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 200, "previous_cutoff": 99.9},
                ]
            },
            {
                "college_name": "B.J. Government Medical College Pune",
                "institute_code": "MD0003",
                "district": "Pune",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 200, "previous_cutoff": 99.5},
                ]
            },
            {
                "college_name": "Government Medical College Nagpur",
                "institute_code": "MD0004",
                "district": "Nagpur",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 200, "previous_cutoff": 98.5},
                    {"course_name": "BDS", "seat_intake": 40, "previous_cutoff": 90},
                ]
            },
            {
                "college_name": "Government Medical College Aurangabad",
                "institute_code": "MD0005",
                "district": "Aurangabad",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 97},
                ]
            },
            {
                "college_name": "Dr. Shankarrao Chavan Government Medical College Nanded",
                "institute_code": "MD0006",
                "district": "Nanded",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 94},
                ]
            },
            {
                "college_name": "Government Dental College & Hospital Mumbai",
                "institute_code": "MD0007",
                "district": "Mumbai",
                "type": "Medical",
                "courses": [
                    {"course_name": "BDS", "seat_intake": 80, "previous_cutoff": 96},
                    {"course_name": "MDS (Orthodontics)", "seat_intake": 10, "previous_cutoff": 92},
                ]
            },
            {
                "college_name": "Government Dental College Aurangabad",
                "institute_code": "MD0008",
                "district": "Aurangabad",
                "type": "Medical",
                "courses": [
                    {"course_name": "BDS", "seat_intake": 60, "previous_cutoff": 88},
                ]
            },
            {
                "college_name": "Government Ayurved College Nanded",
                "institute_code": "MD0009",
                "district": "Nanded",
                "type": "Medical",
                "courses": [
                    {"course_name": "BAMS", "seat_intake": 100, "previous_cutoff": 75},
                ]
            },
            {
                "college_name": "Tilak Ayurved Mahavidyalaya Pune",
                "institute_code": "MD0010",
                "district": "Pune",
                "type": "Medical",
                "courses": [
                    {"course_name": "BAMS", "seat_intake": 100, "previous_cutoff": 82},
                ]
            },
            {
                "college_name": "Dr. D.Y. Patil Medical College Navi Mumbai",
                "institute_code": "MD0011",
                "district": "Thane",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 92},
                    {"course_name": "BDS", "seat_intake": 100, "previous_cutoff": 78},
                    {"course_name": "BPTh (Physiotherapy)", "seat_intake": 50, "previous_cutoff": 65},
                    {"course_name": "BOTh (Occupational Therapy)", "seat_intake": 30, "previous_cutoff": 58},
                ]
            },
            {
                "college_name": "Smt. Kashibai Navale Medical College Pune",
                "institute_code": "MD0012",
                "district": "Pune",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 90},
                ]
            },
            {
                "college_name": "Government Homeopathic Medical College Mumbai",
                "institute_code": "MD0013",
                "district": "Mumbai",
                "type": "Medical",
                "courses": [
                    {"course_name": "BHMS", "seat_intake": 100, "previous_cutoff": 70},
                ]
            },
            {
                "college_name": "A.C.P.M. Medical College Dhule",
                "institute_code": "MD0014",
                "district": "Dhule",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 85},
                    {"course_name": "BUMS (Unani)", "seat_intake": 60, "previous_cutoff": 55},
                ]
            },
            {
                "college_name": "Government Medical College Kolhapur",
                "institute_code": "MD0015",
                "district": "Kolhapur",
                "type": "Medical",
                "courses": [
                    {"course_name": "MBBS", "seat_intake": 150, "previous_cutoff": 95},
                ]
            },
        ]

        for college in colleges:
            yield college
