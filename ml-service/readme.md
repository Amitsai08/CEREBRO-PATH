# Career Platform - ML Recommendation Service

This service provides machine learning-based recommendations for students' career paths and academic streams.

## Overview
The ML service is built with Flask and utilizes several machine learning models to analyze student profiles (scores, interests, and cognitive abilities):
- **Random Forest & Ensemble**: Predicts the best academic stream after 10th grade.
- **K-Means Clustering**: Segments students into cognitive profiles (e.g., Technical Achiever, Creative Thinker).
- **Apriori Algorithm**: Discovers association rules between interests and career paths.

## Prerequisites
- Python 3.8 or higher
- pip (Python package installer)

## Installation

1.  **Navigate to the ML service directory**:
    ```bash
    cd career-platform/ml-service
    ```

2.  **Create a virtual environment** (recommended):
    ```bash
    python -m venv venv
    ```

3.  **Activate the virtual environment**:
    - **Windows**:
      ```bash
      venv\Scripts\activate
      ```
    - **macOS/Linux**:
      ```bash
      source venv/bin/activate
      ```

4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Running the Service

1.  **Start the Flask application**:
    ```bash
    python app.py
    ```
    The service will be available at `http://localhost:8000`.

## API Endpoints

- `GET /`: Health check and model status.
- `POST /api/recommend/stream`: Predicts academic stream after 10th.
- `POST /api/recommend/course`: Predicts career course after 12th.
- `GET /api/recommend/associations`: Returns association rules from Apriori.
- `POST /api/cluster/student`: Assigns students to cognitive clusters.

---
*Note: On first run, the service trained with synthetic data provided in `app.py`.*
