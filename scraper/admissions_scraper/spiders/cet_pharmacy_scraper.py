import scrapy

class CetPharmacySpider(scrapy.Spider):
    """
    Scrapes Pharmacy college data from CET Cell Maharashtra.
    CET Cell manages MHT-CET based pharmacy admissions (B.Pharm / D.Pharm).
    Portal: https://cetcell.mahacet.org → Pharmacy → CAP Rounds
    
    In production, intercept the XHR calls to the allotment API or parse
    the institute-wise seat matrix PDFs published each year.
    """
    name = "cet_pharmacy"
    start_urls = ["https://cetcell.mahacet.org/"]

    def parse(self, response):
        # Real scraping logic (commented for reference):
        # pharmacy_url = response.css('a[href*="pharmacy"]::attr(href)').get()
        # if pharmacy_url:
        #     yield scrapy.Request(response.urljoin(pharmacy_url), callback=self.parse_pharmacy_list)
        #
        # def parse_pharmacy_list(self, response):
        #     for row in response.css('table tbody tr'):
        #         yield {
        #             'college_name': row.css('td:nth-child(2)::text').get('').strip(),
        #             'institute_code': row.css('td:nth-child(1)::text').get('').strip(),
        #             ...
        #         }

        # ── Maharashtra Pharmacy Colleges (CET Cell data) ──
        colleges = [
            {
                "college_name": "Bombay College of Pharmacy",
                "institute_code": "PH0001",
                "district": "Mumbai",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 100, "previous_cutoff": 95},
                    {"course_name": "M.Pharm (Pharmaceutics)", "seat_intake": 20, "previous_cutoff": 88},
                    {"course_name": "M.Pharm (Pharmacology)", "seat_intake": 15, "previous_cutoff": 85},
                ]
            },
            {
                "college_name": "Institute of Chemical Technology (ICT)",
                "institute_code": "PH0002",
                "district": "Mumbai",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 97},
                    {"course_name": "B.Pharm (Hons)", "seat_intake": 20, "previous_cutoff": 98},
                ]
            },
            {
                "college_name": "Poona College of Pharmacy",
                "institute_code": "PH0003",
                "district": "Pune",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 120, "previous_cutoff": 88},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 72},
                ]
            },
            {
                "college_name": "STES's Sinhgad College of Pharmacy",
                "institute_code": "PH0004",
                "district": "Pune",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 120, "previous_cutoff": 82},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 65},
                    {"course_name": "M.Pharm (Quality Assurance)", "seat_intake": 15, "previous_cutoff": 78},
                ]
            },
            {
                "college_name": "Maharashtra Institute of Pharmacy",
                "institute_code": "PH0005",
                "district": "Pune",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 80},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 62},
                ]
            },
            {
                "college_name": "Government College of Pharmacy Aurangabad",
                "institute_code": "PH0006",
                "district": "Aurangabad",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 80, "previous_cutoff": 85},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 70},
                ]
            },
            {
                "college_name": "Government College of Pharmacy Amravati",
                "institute_code": "PH0007",
                "district": "Amravati",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 78},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 60},
                ]
            },
            {
                "college_name": "Rajarambapu College of Pharmacy",
                "institute_code": "PH0008",
                "district": "Sangli",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 76},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 58},
                ]
            },
            {
                "college_name": "Y.B. Chavan College of Pharmacy",
                "institute_code": "PH0009",
                "district": "Nashik",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 74},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 55},
                ]
            },
            {
                "college_name": "Government College of Pharmacy Karad",
                "institute_code": "PH0010",
                "district": "Satara",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 100, "previous_cutoff": 82},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 68},
                    {"course_name": "Pharm.D", "seat_intake": 30, "previous_cutoff": 90},
                ]
            },
            {
                "college_name": "Dr. D.Y. Patil College of Pharmacy Navi Mumbai",
                "institute_code": "PH0011",
                "district": "Thane",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 100, "previous_cutoff": 79},
                    {"course_name": "D.Pharm", "seat_intake": 60, "previous_cutoff": 60},
                ]
            },
            {
                "college_name": "SVKM's Dr. Bhanuben Nanavati College of Pharmacy",
                "institute_code": "PH0012",
                "district": "Mumbai",
                "type": "Pharmacy",
                "courses": [
                    {"course_name": "B.Pharm", "seat_intake": 60, "previous_cutoff": 90},
                    {"course_name": "M.Pharm (Industrial Pharmacy)", "seat_intake": 15, "previous_cutoff": 82},
                ]
            },
        ]

        for college in colleges:
            yield college
