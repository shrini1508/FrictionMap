# FrictionMap

FrictionMap is a process friction analysis system that helps identify potential friction points in workflows and provides an overall friction score, risk level, severity classification, impact scores, and recommendations for improving the process.

## Project Overview

Many real-world processes contain unnecessary waiting, manual work, approvals, repetitive tasks, verification steps, payment difficulties, and navigation problems.

FrictionMap analyzes the steps of a process and identifies these potential friction points automatically.

For each detected friction point, the system provides:

* Friction type
* Severity level
* Impact score
* Recommendation for improvement

The system also calculates an overall **Friction Score** and displays the corresponding **Risk Level**.

---

## Features

### 1. Process Analysis

Users can enter:

* Process name
* Individual process steps

The system analyzes each step and detects possible friction.

### 2. Friction Score

The system calculates an overall friction score based on the detected friction points.

The score is displayed as a percentage from **0% to 100%**.

### 3. Risk Classification

The overall score is classified into three levels:

| Score      | Risk Level |
| ---------- | ---------- |
| 70% – 100% | HIGH       |
| 40% – 69%  | MEDIUM     |
| 0% – 39%   | LOW        |

### 4. Friction Point Detection

The backend detects different categories of friction, including:

* Waiting / Delay
* Queue / Waiting
* Approval
* Manual Work
* Payment
* Form Filling
* Verification
* Authentication
* Navigation
* Repetitive Work

### 5. Severity Classification

Every detected friction point is classified as:

* HIGH
* MEDIUM
* LOW

### 6. Impact Score

Each friction rule has an impact score that represents the potential effect of that friction point on the user experience.

### 7. Recommendations

The system provides a recommendation for each detected friction point.

For example:

**Friction:** Wait for approval

**Recommendation:** Reduce waiting time by automating the approval process.

### 8. Process Map

The frontend displays the process steps as a visual process map.

Each step is represented according to its severity.

### 9. Severity Summary

The dashboard displays the number of:

* High severity points
* Medium severity points
* Low severity points

### 10. Analysis History

The frontend stores recent analysis results and displays:

* Process name
* Friction score
* Risk level
* Number of friction points
* Analysis date and time

The latest analyses are displayed first.

---

# Technology Stack

## Backend

* Python
* Flask
* Flask-CORS

## Frontend

* HTML
* CSS
* JavaScript
* Fetch API
* LocalStorage

## Development Tools

* Git
* GitHub
* Visual Studio Code / Notepad
* PowerShell

---

# Project Structure

```text
FrictionMap/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
│
└── README.md
```

> The exact frontend filenames may vary depending on the current project structure.

---

# Backend

The backend is implemented using Flask.

The Flask server provides the API used by the frontend to analyze process steps.

## Main API Endpoint

### POST `/analyze`

This endpoint receives a process name and a list of process steps.

### Example Request

```json
{
  "process_name": "College Admission",
  "steps": [
    "Fill application",
    "Wait for approval",
    "Upload documents manually",
    "Make payment"
  ]
}
```

### Example Response

```json
{
  "process_name": "College Admission",
  "number_of_steps": 4,
  "friction_score": 75,
  "risk_level": "HIGH",
  "friction_points": [
    {
      "step": "Wait for approval",
      "type": "Waiting / Delay",
      "severity": "High",
      "impact": 90,
      "recommendation": "Reduce waiting time by automating the approval process."
    },
    {
      "step": "Upload documents manually",
      "type": "Manual Work",
      "severity": "Medium",
      "impact": 60,
      "recommendation": "Allow users to upload multiple documents at once."
    },
    {
      "step": "Make payment",
      "type": "Payment",
      "severity": "Medium",
      "impact": 50,
      "recommendation": "Provide simple and multiple payment options."
    }
  ]
}
```

---

# Running the Backend

## 1. Open the project directory

```powershell
cd C:\Users\srija\OneDrive\Desktop\FrictionMap
```

## 2. Create a virtual environment

```powershell
python -m venv venv
```

## 3. Activate the virtual environment

On Windows Command Prompt:

```cmd
venv\Scripts\activate
```

If PowerShell blocks script execution, the backend can also be run directly using:

```powershell
.\venv\Scripts\python.exe backend\app.py
```

## 4. Install dependencies

```powershell
pip install flask flask-cors
```

## 5. Start the backend

```powershell
.\venv\Scripts\python.exe backend\app.py
```

The backend runs at:

```text
http://127.0.0.1:5000
```

---

# Frontend

The frontend provides the user interface for entering processes and viewing the analysis results.

The frontend communicates with the Flask backend using the Fetch API.

The main workflow is:

```text
User enters process
        ↓
User enters process steps
        ↓
Frontend sends request
        ↓
Flask /analyze API
        ↓
Backend analyzes steps
        ↓
Friction points detected
        ↓
Friction score calculated
        ↓
Response sent to frontend
        ↓
Results displayed
```

---

# Example Analysis

## Input

**Process:**

```text
College Admission
```

**Steps:**

```text
Fill application
Wait for approval
Upload documents manually
Make payment
```

## Output

```text
Friction Score: 75%

Risk Level: HIGH

Friction Points: 3
```

Detected friction points include:

```text
Wait for approval
→ Waiting / Delay
→ High Severity
→ Impact: 90/100

Upload documents manually
→ Manual Work
→ Medium Severity
→ Impact: 60/100

Make payment
→ Payment
→ Medium Severity
→ Impact: 50/100
```

---

# Friction Rules

The backend contains keyword-based rules that identify friction from process steps.

Examples include:

| Keyword      | Friction Type   | Severity |
| ------------ | --------------- | -------- |
| wait         | Waiting / Delay | High     |
| waiting      | Waiting / Delay | High     |
| approval     | Approval        | High     |
| queue        | Queue / Waiting | High     |
| upload       | Manual Work     | Medium   |
| manual       | Manual Work     | Medium   |
| payment      | Payment         | Medium   |
| form         | Form Filling    | Medium   |
| verification | Verification    | Medium   |
| login        | Authentication  | Low      |

The rules can be extended as the project evolves.

---

# API Testing

The backend can be tested using PowerShell.

Example:

```powershell
$response = Invoke-RestMethod `
    -Uri "http://127.0.0.1:5000/analyze" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"process_name":"College Admission","steps":["Fill application","Wait for approval","Upload documents manually","Make payment"]}'
```

To display the complete response:

```powershell
$response | ConvertTo-Json -Depth 10
```

To display only the friction score:

```powershell
$response.friction_score
```

Expected:

```text
75
```

---

# Frontend and Backend Integration

The frontend sends the process information to:

```text
POST http://127.0.0.1:5000/analyze
```

The request is sent as JSON.

The backend returns the analysis result as JSON.

The frontend then displays:

* Analysis result
* Friction score
* Risk level
* Progress bar
* Process map
* Severity summary
* Friction cards
* Impact scores
* Recommendations
* Analysis history

---

# History

The frontend maintains analysis history using browser LocalStorage.

The history contains:

* Process name
* Friction score
* Risk level
* Number of friction points
* Date and time

The interface also provides an option to clear the stored history.

---

# CORS

Flask-CORS is enabled so that the frontend can communicate with the Flask backend when they are running on different local origins.

The backend includes:

```python
from flask_cors import CORS

CORS(app)
```

---

# Git and GitHub

The project is maintained using Git and GitHub for team collaboration.

The repository contains the source code required for the project.

## Important

The virtual environment is not included in the repository.

The `.gitignore` file excludes:

```text
venv/
__pycache__/
*.pyc
.env
.vscode/
```

Each team member should create their own virtual environment after cloning the project.

---

# Setup for Team Members

After cloning the repository:

```powershell
git clone https://github.com/shrini1508/FrictionMap.git
```

Enter the project:

```powershell
cd FrictionMap
```

Create a virtual environment:

```powershell
python -m venv venv
```

Install dependencies:

```powershell
.\venv\Scripts\python.exe -m pip install flask flask-cors
```

Run the backend:

```powershell
.\venv\Scripts\python.exe backend\app.py
```

Then open the frontend and make sure the Flask backend is running.

---

# Current Project Status

## Completed

* [x] Flask backend
* [x] `/analyze` API
* [x] Friction detection
* [x] Severity classification
* [x] Impact scores
* [x] Friction score calculation
* [x] Risk classification
* [x] Recommendations
* [x] Frontend integration
* [x] Visual friction score
* [x] Color-coded severity
* [x] Process map
* [x] Severity summary
* [x] Analysis history
* [x] GitHub repository setup

## Future Improvements

Possible future enhancements include:

* AI/LLM-based friction detection
* Database-backed history
* User authentication
* Advanced analytics dashboard
* Process comparison
* Export analysis reports
* More intelligent recommendations
* Machine-learning-based friction prediction

---

# Team

**Project:** FrictionMap

**Repository:**
https://github.com/shrini1508/FrictionMap

This project is developed as a collaborative team project.
