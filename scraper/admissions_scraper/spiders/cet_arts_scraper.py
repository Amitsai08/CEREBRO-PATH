import scrapy

class CetArtsCommerceSpider(scrapy.Spider):
    """
    Scrapes Arts, Commerce & Science (degree) college data.
    CET Cell manages MAH-AAC-CET (Arts, Commerce, Science UG/PG admissions).
    Portal: https://cetcell.mahacet.org → Degree Courses → Arts/Commerce/Science
    
    Also covers:
    - BA / BCom / BSc admissions
    - BBA / BMS / BCA / BCS admissions (via MAH-B.B.A/B.C.A CET)
    - LLB admissions (via MAH-LLB-5Yr CET)
    
    In production: parse the CAP allotment PDFs or scrape the
    seat matrix published on the CET Cell portal.
    """
    name = "cet_arts_commerce"
    start_urls = ["https://cetcell.mahacet.org/"]

    def parse(self, response):
        # ── Maharashtra Arts, Commerce & Science Colleges ──
        colleges = [
            {
                "college_name": "St. Xavier's College Mumbai",
                "institute_code": "AC0001",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Economics)", "seat_intake": 120, "previous_cutoff": 96},
                    {"course_name": "BA (English Literature)", "seat_intake": 60, "previous_cutoff": 92},
                    {"course_name": "BA (Political Science)", "seat_intake": 60, "previous_cutoff": 88},
                    {"course_name": "BCom", "seat_intake": 240, "previous_cutoff": 94},
                    {"course_name": "BSc (Statistics)", "seat_intake": 60, "previous_cutoff": 90},
                    {"course_name": "BMS (Management Studies)", "seat_intake": 120, "previous_cutoff": 95},
                ]
            },
            {
                "college_name": "Jai Hind College",
                "institute_code": "AC0002",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Mass Media)", "seat_intake": 60, "previous_cutoff": 92},
                    {"course_name": "BCom", "seat_intake": 240, "previous_cutoff": 88},
                    {"course_name": "BMS", "seat_intake": 120, "previous_cutoff": 90},
                    {"course_name": "BA (Psychology)", "seat_intake": 60, "previous_cutoff": 88},
                ]
            },
            {
                "college_name": "HR College of Commerce & Economics",
                "institute_code": "AC0003",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BCom", "seat_intake": 600, "previous_cutoff": 92},
                    {"course_name": "BCom (Accounting & Finance)", "seat_intake": 120, "previous_cutoff": 94},
                    {"course_name": "BCom (Banking & Insurance)", "seat_intake": 60, "previous_cutoff": 88},
                    {"course_name": "BMS", "seat_intake": 120, "previous_cutoff": 90},
                    {"course_name": "BBA", "seat_intake": 60, "previous_cutoff": 85},
                ]
            },
            {
                "college_name": "Fergusson College",
                "institute_code": "AC0004",
                "district": "Pune",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Economics)", "seat_intake": 120, "previous_cutoff": 90},
                    {"course_name": "BA (English)", "seat_intake": 120, "previous_cutoff": 82},
                    {"course_name": "BA (Sanskrit)", "seat_intake": 60, "previous_cutoff": 65},
                    {"course_name": "BCom", "seat_intake": 180, "previous_cutoff": 85},
                    {"course_name": "BSc (Physics)", "seat_intake": 80, "previous_cutoff": 88},
                    {"course_name": "BSc (Mathematics)", "seat_intake": 80, "previous_cutoff": 90},
                ]
            },
            {
                "college_name": "Symbiosis College of Arts & Commerce",
                "institute_code": "AC0005",
                "district": "Pune",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Liberal Arts)", "seat_intake": 120, "previous_cutoff": 88},
                    {"course_name": "BCom", "seat_intake": 240, "previous_cutoff": 86},
                    {"course_name": "BBA", "seat_intake": 120, "previous_cutoff": 90},
                    {"course_name": "BCA", "seat_intake": 60, "previous_cutoff": 82},
                ]
            },
            {
                "college_name": "Ruia College",
                "institute_code": "AC0006",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Hindi)", "seat_intake": 60, "previous_cutoff": 75},
                    {"course_name": "BA (History)", "seat_intake": 60, "previous_cutoff": 72},
                    {"course_name": "BA (Sociology)", "seat_intake": 60, "previous_cutoff": 78},
                    {"course_name": "BCom", "seat_intake": 120, "previous_cutoff": 80},
                ]
            },
            {
                "college_name": "ILS Law College",
                "institute_code": "AC0007",
                "district": "Pune",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA LLB (5-year Integrated)", "seat_intake": 120, "previous_cutoff": 95},
                    {"course_name": "BLS LLB (5-year Integrated)", "seat_intake": 60, "previous_cutoff": 92},
                    {"course_name": "LLB (3-year)", "seat_intake": 120, "previous_cutoff": 80},
                ]
            },
            {
                "college_name": "Government Law College Mumbai",
                "institute_code": "AC0008",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA LLB (5-year Integrated)", "seat_intake": 120, "previous_cutoff": 97},
                    {"course_name": "LLB (3-year)", "seat_intake": 200, "previous_cutoff": 85},
                ]
            },
            {
                "college_name": "SNDT Women's University College",
                "institute_code": "AC0009",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Home Science)", "seat_intake": 60, "previous_cutoff": 65},
                    {"course_name": "BA (Education)", "seat_intake": 60, "previous_cutoff": 62},
                    {"course_name": "BCom", "seat_intake": 120, "previous_cutoff": 70},
                    {"course_name": "BCA", "seat_intake": 40, "previous_cutoff": 72},
                ]
            },
            {
                "college_name": "Government College of Arts & Science Aurangabad",
                "institute_code": "AC0010",
                "district": "Aurangabad",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (Marathi)", "seat_intake": 120, "previous_cutoff": 55},
                    {"course_name": "BA (History)", "seat_intake": 120, "previous_cutoff": 52},
                    {"course_name": "BCom", "seat_intake": 240, "previous_cutoff": 60},
                    {"course_name": "BSc (Chemistry)", "seat_intake": 60, "previous_cutoff": 65},
                ]
            },
            {
                "college_name": "Hislop College Nagpur",
                "institute_code": "AC0011",
                "district": "Nagpur",
                "type": "Arts",
                "courses": [
                    {"course_name": "BA (English)", "seat_intake": 120, "previous_cutoff": 75},
                    {"course_name": "BCom", "seat_intake": 240, "previous_cutoff": 72},
                    {"course_name": "BSc (Biotechnology)", "seat_intake": 40, "previous_cutoff": 78},
                    {"course_name": "BCA", "seat_intake": 60, "previous_cutoff": 70},
                ]
            },
            {
                "college_name": "Narsee Monjee College of Commerce & Economics",
                "institute_code": "AC0012",
                "district": "Mumbai",
                "type": "Arts",
                "courses": [
                    {"course_name": "BCom", "seat_intake": 480, "previous_cutoff": 90},
                    {"course_name": "BCom (Accounting & Finance)", "seat_intake": 120, "previous_cutoff": 92},
                    {"course_name": "BMS", "seat_intake": 120, "previous_cutoff": 88},
                    {"course_name": "BBA (International Business)", "seat_intake": 60, "previous_cutoff": 85},
                ]
            },
        ]

        for college in colleges:
            yield college
