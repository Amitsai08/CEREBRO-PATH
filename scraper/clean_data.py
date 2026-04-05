"""
Data Cleaning Script for Scraped College Data
Uses Pandas to normalize, deduplicate, and validate scraped data 
before seeding into MongoDB.
"""
import pandas as pd
import json
import sys
import os

def clean_colleges(input_file, output_file):
    """Clean and normalize scraped college data."""
    print(f"Loading data from {input_file}...")
    
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f"Loaded {len(raw_data)} records")
    
    cleaned = []
    seen_codes = set()
    
    for record in raw_data:
        # Skip duplicates by institute_code
        code = record.get('institute_code', '').strip()
        if not code or code in seen_codes:
            continue
        seen_codes.add(code)
        
        # Normalize college name
        name = record.get('college_name', '').strip()
        if not name:
            continue
        
        # Normalize district
        district = record.get('district', '').strip().title()
        
        # Normalize type
        col_type = record.get('type', '').strip()
        valid_types = ['Engineering', 'Diploma', 'FYJC', 'Pharmacy', 'Medical', 'Arts']
        if col_type not in valid_types:
            col_type = 'Other'  # default for unrecognized types
        
        # Clean courses
        courses = []
        for course in record.get('courses', []):
            course_name = course.get('course_name', '').strip()
            if not course_name:
                continue
            
            seat_intake = course.get('seat_intake', 0)
            if isinstance(seat_intake, str):
                seat_intake = int(seat_intake) if seat_intake.isdigit() else 0
            
            cutoff = course.get('previous_cutoff', 0)
            if isinstance(cutoff, str):
                try:
                    cutoff = float(cutoff)
                except ValueError:
                    cutoff = 0
            
            courses.append({
                'course_name': course_name,
                'seat_intake': max(0, int(seat_intake)),
                'previous_cutoff': max(0, min(100, float(cutoff)))
            })
        
        if not courses:
            continue
        
        cleaned.append({
            'college_name': name,
            'institute_code': code,
            'district': district,
            'type': col_type,
            'courses': courses
        })
    
    print(f"Cleaned: {len(cleaned)} valid records (removed {len(raw_data) - len(cleaned)} invalid/duplicate)")
    
    # Save cleaned data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)
    
    print(f"Saved to {output_file}")
    
    # Print statistics
    df = pd.DataFrame(cleaned)
    print("\n--- Data Statistics ---")
    print(f"Total colleges: {len(df)}")
    print(f"Districts: {df['district'].nunique()}")
    print(f"Types: {dict(df['type'].value_counts())}")
    print(f"Total courses: {sum(len(c['courses']) for c in cleaned)}")
    
    return cleaned

if __name__ == '__main__':
    input_path = sys.argv[1] if len(sys.argv) > 1 else 'colleges_raw.json'
    output_path = sys.argv[2] if len(sys.argv) > 2 else 'colleges_cleaned.json'
    clean_colleges(input_path, output_path)
