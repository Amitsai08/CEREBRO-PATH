from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import os
import joblib
import json

app = Flask(__name__)
CORS(app)

# ─────── Training Data ───────
# Synthetic student data for training our models
# Features: math_score, science_score, language_score, logical_ability, creativity, technical_interest
training_data = pd.DataFrame({
    'math_score':        [95, 88, 45, 60, 92, 78, 50, 42, 97, 80, 55, 38, 90, 72, 48, 65, 85, 40, 93, 70],
    'science_score':     [92, 85, 50, 55, 90, 70, 45, 48, 95, 75, 52, 42, 88, 68, 55, 60, 82, 38, 91, 65],
    'language_score':    [70, 65, 88, 82, 68, 72, 85, 90, 72, 78, 80, 92, 60, 75, 88, 70, 70, 85, 65, 80],
    'logical_ability':   [90, 82, 55, 60, 88, 75, 50, 48, 95, 70, 58, 40, 85, 72, 52, 62, 80, 42, 92, 68],
    'creativity':        [60, 55, 90, 85, 62, 65, 88, 92, 58, 68, 82, 95, 55, 70, 85, 72, 60, 90, 55, 75],
    'technical_interest': [92, 88, 40, 50, 95, 70, 45, 38, 90, 65, 48, 35, 88, 60, 42, 55, 85, 40, 93, 58],
    'stream':            ['Science', 'Science', 'Arts', 'Commerce', 'Science', 'Commerce', 'Arts', 'Arts',
                          'Science', 'Commerce', 'Arts', 'Arts', 'Science', 'Commerce', 'Arts', 'Diploma',
                          'Science', 'Arts', 'Science', 'Commerce']
})

course_training_data = pd.DataFrame({
    'math_score':        [95, 88, 60, 70, 92, 82, 55, 45, 97, 78],
    'science_score':     [92, 85, 55, 65, 90, 78, 50, 48, 95, 72],
    'logical_ability':   [90, 82, 60, 65, 88, 75, 55, 48, 95, 70],
    'creativity':        [60, 55, 75, 80, 62, 65, 85, 90, 58, 68],
    'technical_interest': [92, 88, 50, 55, 95, 72, 45, 40, 90, 65],
    'business_interest':  [30, 35, 80, 75, 25, 60, 40, 30, 20, 70],
    'research_interest':  [40, 50, 45, 40, 35, 55, 60, 70, 85, 45],
    'course':            ['Computer Engineering', 'IT Engineering', 'BBA/BMS', 'Commerce/CA',
                          'Computer Engineering', 'Mechanical Engineering', 'Design/Media', 'Arts/Journalism',
                          'BSc Research', 'Commerce/CA']
})

# ─────── Train Models ───────
feature_cols_stream = ['math_score', 'science_score', 'language_score', 'logical_ability', 'creativity', 'technical_interest']
le_stream = LabelEncoder()
training_data['stream_encoded'] = le_stream.fit_transform(training_data['stream'])

X_stream = training_data[feature_cols_stream].values
y_stream = training_data['stream_encoded'].values

# Random Forest
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_stream, y_stream)

# Decision Tree
dt_model = DecisionTreeClassifier(max_depth=5, random_state=42)
dt_model.fit(X_stream, y_stream)

# Logistic Regression
lr_model = LogisticRegression(max_iter=1000, random_state=42)
lr_model.fit(X_stream, y_stream)

# Course models
feature_cols_course = ['math_score', 'science_score', 'logical_ability', 'creativity', 'technical_interest', 'business_interest', 'research_interest']
le_course = LabelEncoder()
course_training_data['course_encoded'] = le_course.fit_transform(course_training_data['course'])
X_course = course_training_data[feature_cols_course].values
y_course = course_training_data['course_encoded'].values

rf_course = RandomForestClassifier(n_estimators=100, random_state=42)
rf_course.fit(X_course, y_course)

# K-Means Clustering (for student segmentation)
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(X_stream)

# Apriori (association rules)
basket_data = pd.DataFrame({
    'Science':   [1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    'Commerce':  [0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    'Arts':      [0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    'Engineering': [1, 1, 0, 0, 1, 0, 0, 0, 1, 0],
    'Medical':   [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    'Business':  [0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    'Design':    [0, 0, 1, 0, 0, 0, 1, 1, 0, 0],
    'Research':  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
})
freq_items = apriori(basket_data, min_support=0.2, use_colnames=True)
rules = association_rules(freq_items, metric="confidence", min_threshold=0.5, num_itemsets=len(freq_items))

print("✓ All ML models trained successfully")
print(f"  Random Forest: {rf_model.score(X_stream, y_stream):.2%} accuracy")
print(f"  Decision Tree: {dt_model.score(X_stream, y_stream):.2%} accuracy")
print(f"  Logistic Regression: {lr_model.score(X_stream, y_stream):.2%} accuracy")
print(f"  K-Means: {kmeans.n_clusters} clusters identified")
print(f"  Apriori: {len(rules)} association rules discovered")

# ─────── API Endpoints ───────

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ML Recommendation Engine is running",
        "models": ["Random Forest", "Decision Tree", "Logistic Regression", "K-Means", "Apriori"],
        "stream_classes": list(le_stream.classes_),
        "course_classes": list(le_course.classes_)
    })

@app.route('/api/recommend/stream', methods=['POST'])
def recommend_stream():
    """
    After 10th: Takes student scores and predicts best stream.
    Uses ensemble of Random Forest, Decision Tree, and Logistic Regression.
    """
    try:
        data = request.json
        
        # Extract features from questionnaire answers or direct scores
        features = np.array([[
            data.get('math_score', 70),
            data.get('science_score', 70),
            data.get('language_score', 70),
            data.get('logical_ability', 70),
            data.get('creativity', 50),
            data.get('technical_interest', 50),
        ]])
        
        # Ensemble predictions
        rf_pred = rf_model.predict(features)[0]
        dt_pred = dt_model.predict(features)[0]
        lr_pred = lr_model.predict(features)[0]
        
        # Majority voting
        predictions = [rf_pred, dt_pred, lr_pred]
        final_pred = max(set(predictions), key=predictions.count)
        
        # Confidence from Random Forest
        rf_proba = rf_model.predict_proba(features)[0]
        confidence = float(max(rf_proba))
        
        # K-Means cluster
        cluster = int(kmeans.predict(features)[0])
        cluster_labels = {0: "Technical Achiever", 1: "Creative Thinker", 2: "Business Strategist", 3: "Balanced Learner"}
        
        result_stream = le_stream.inverse_transform([final_pred])[0]
        
        # All model results
        all_predictions = {
            "random_forest": le_stream.inverse_transform([rf_pred])[0],
            "decision_tree": le_stream.inverse_transform([dt_pred])[0],
            "logistic_regression": le_stream.inverse_transform([lr_pred])[0],
        }
        
        return jsonify({
            "success": True,
            "recommended_stream": result_stream,
            "confidence": confidence,
            "student_cluster": cluster_labels.get(cluster, "General"),
            "all_model_predictions": all_predictions,
            "probabilities": {le_stream.inverse_transform([i])[0]: float(p) for i, p in enumerate(rf_proba)}
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/recommend/course', methods=['POST'])
def recommend_course():
    """
    After 12th: Predicts best course/career path.
    """
    try:
        data = request.json
        features = np.array([[
            data.get('math_score', 70),
            data.get('science_score', 70),
            data.get('logical_ability', 70),
            data.get('creativity', 50),
            data.get('technical_interest', 50),
            data.get('business_interest', 30),
            data.get('research_interest', 30),
        ]])
        
        prediction = rf_course.predict(features)[0]
        proba = rf_course.predict_proba(features)[0]
        confidence = float(max(proba))
        result_course = le_course.inverse_transform([prediction])[0]
        
        # Top 3 courses
        top_indices = np.argsort(proba)[-3:][::-1]
        top_courses = [
            {"course": le_course.inverse_transform([i])[0], "probability": float(proba[i])}
            for i in top_indices
        ]
        
        return jsonify({
            "success": True,
            "recommended_course": result_course,
            "confidence": confidence,
            "top_courses": top_courses
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/recommend/associations', methods=['GET'])
def get_associations():
    """
    Returns Apriori association rules mapping interests → careers.
    """
    try:
        rules_list = []
        for _, rule in rules.iterrows():
            rules_list.append({
                "antecedents": list(rule['antecedents']),
                "consequents": list(rule['consequents']),
                "confidence": round(float(rule['confidence']), 2),
                "support": round(float(rule['support']), 2),
                "lift": round(float(rule['lift']), 2),
            })
        return jsonify({"success": True, "association_rules": rules_list})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/cluster/student', methods=['POST'])
def cluster_student():
    """
    Assigns a student to a K-Means cluster to find similar peers.
    """
    try:
        data = request.json
        features = np.array([[
            data.get('math_score', 70),
            data.get('science_score', 70),
            data.get('language_score', 70),
            data.get('logical_ability', 70),
            data.get('creativity', 50),
            data.get('technical_interest', 50),
        ]])
        cluster = int(kmeans.predict(features)[0])
        labels = {0: "Technical Achiever", 1: "Creative Thinker", 2: "Business Strategist", 3: "Balanced Learner"}
        return jsonify({
            "success": True,
            "cluster_id": cluster,
            "cluster_label": labels.get(cluster, "General"),
            "description": f"You belong to the '{labels.get(cluster, 'General')}' group based on your cognitive profile."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
