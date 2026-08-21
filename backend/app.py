
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "FrictionMap Backend is running!"
    })


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.json or {}

    process_name = data.get("process_name", "")
    steps = data.get("steps", [])

    friction_rules = {

        # WAITING / DELAY
        "wait": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce waiting time by automating the approval process."
        },

        "waiting": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce waiting time by automating the approval process."
        },

        "pending": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce waiting time by providing faster processing and status updates."
        },

        "delay": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce processing delays by automating the workflow."
        },

        "delayed": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce processing delays by automating the workflow."
        },

        "slow": {
            "type": "Waiting / Delay",
            "severity": "High",
            "impact": 80,
            "recommendation":
                "Improve processing speed and reduce unnecessary waiting."
        },

        "queue": {
            "type": "Queue / Waiting",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Reduce queue time by increasing processing capacity."
        },

        "stand in line": {
            "type": "Queue / Waiting",
            "severity": "High",
            "impact": 90,
            "recommendation":
                "Provide a digital queue or appointment system."
        },

        # APPROVAL
        "approval": {
            "type": "Approval",
            "severity": "High",
            "impact": 85,
            "recommendation":
                "Automate or simplify the approval workflow."
        },

        "approve": {
            "type": "Approval",
            "severity": "High",
            "impact": 85,
            "recommendation":
                "Automate or simplify the approval workflow."
        },

        "review": {
            "type": "Approval / Review",
            "severity": "High",
            "impact": 75,
            "recommendation":
                "Simplify the review process and reduce unnecessary approvals."
        },

        "manager approval": {
            "type": "Approval",
            "severity": "High",
            "impact": 85,
            "recommendation":
                "Automate manager approval where possible."
        },

        # MANUAL WORK
        "upload": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Allow users to upload multiple documents at once."
        },

        "manual": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Automate this manual task if possible."
        },

        "enter manually": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Automatically populate information instead of requiring manual entry."
        },

        "type manually": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Reduce manual typing by automatically filling available information."
        },

        "copy and paste": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 65,
            "recommendation":
                "Automate repetitive copy-and-paste operations."
        },

        "enter details": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 55,
            "recommendation":
                "Automatically populate user information where possible."
        },

        # PAYMENT
        "payment failed": {
            "type": "Payment",
            "severity": "High",
            "impact": 75,
            "recommendation":
                "Provide reliable payment processing and alternative payment methods."
        },

        "transaction failed": {
            "type": "Payment",
            "severity": "High",
            "impact": 75,
            "recommendation":
                "Provide reliable payment processing and alternative payment methods."
        },

        "payment": {
            "type": "Payment",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Provide simple and multiple payment options."
        },

        "pay": {
            "type": "Payment",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Provide simple and multiple payment options."
        },

        "checkout": {
            "type": "Payment / Checkout",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Simplify the checkout process and reduce unnecessary steps."
        },

        # FORM FILLING
        "too many fields": {
            "type": "Form Filling",
            "severity": "Medium",
            "impact": 65,
            "recommendation":
                "Reduce unnecessary fields and group related information."
        },

        "fill form": {
            "type": "Form Filling",
            "severity": "Medium",
            "impact": 55,
            "recommendation":
                "Reduce unnecessary fields in the form."
        },

        "form": {
            "type": "Form Filling",
            "severity": "Medium",
            "impact": 55,
            "recommendation":
                "Reduce unnecessary fields in the form."
        },

        "enter information": {
            "type": "Form Filling",
            "severity": "Medium",
            "impact": 55,
            "recommendation":
                "Simplify data entry and automatically fill known information."
        },

        # VERIFICATION
        "document verification": {
            "type": "Verification",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Automate document verification where possible."
        },

        "verification": {
            "type": "Verification",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Simplify the verification process."
        },

        "verify": {
            "type": "Verification",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Simplify the verification process."
        },

        "otp": {
            "type": "Verification",
            "severity": "Medium",
            "impact": 45,
            "recommendation":
                "Make OTP verification faster and easier."
        },

        # LOGIN
        "forgot password": {
            "type": "Authentication",
            "severity": "Medium",
            "impact": 45,
            "recommendation":
                "Provide a simple password recovery process."
        },

        "login": {
            "type": "Authentication",
            "severity": "Low",
            "impact": 25,
            "recommendation":
                "Provide a simpler login experience."
        },

        "sign in": {
            "type": "Authentication",
            "severity": "Low",
            "impact": 25,
            "recommendation":
                "Provide a simpler login experience."
        },

        "password": {
            "type": "Authentication",
            "severity": "Low",
            "impact": 25,
            "recommendation":
                "Provide a simpler authentication experience."
        },

        # NAVIGATION
        "search": {
            "type": "Navigation",
            "severity": "Low",
            "impact": 20,
            "recommendation":
                "Improve search and navigation to help users find information faster."
        },

        "find": {
            "type": "Navigation",
            "severity": "Low",
            "impact": 20,
            "recommendation":
                "Improve navigation and make important information easier to find."
        },

        # REPETITIVE TASKS
        "copy and paste": {
            "type": "Manual Work",
            "severity": "Medium",
            "impact": 65,
            "recommendation":
                "Automate repetitive copy-and-paste operations."
        },

        "re-enter": {
            "type": "Repetitive Work",
            "severity": "Medium",
            "impact": 60,
            "recommendation":
                "Avoid asking users to enter the same information multiple times."
        },

        "repeat": {
            "type": "Repetitive Work",
            "severity": "Medium",
            "impact": 55,
            "recommendation":
                "Automate repetitive tasks to reduce user effort."
        },

        "again": {
            "type": "Repetitive Work",
            "severity": "Medium",
            "impact": 50,
            "recommendation":
                "Reduce repeated actions and automate recurring tasks."
        }
    }


    # ANALYZE STEPS

    friction_points = []

    total_impact = 0


    for step in steps:

        step_lower = str(step).lower()

        for word, rule in friction_rules.items():

            if word in step_lower:

                friction_points.append({

                    "step": step,

                    "type": rule["type"],

                    "severity": rule["severity"],

                    "impact": rule["impact"],

                    "recommendation":
                        rule["recommendation"]

                })

                total_impact += rule["impact"]

                break


    # CALCULATE FRICTION SCORE
    # Score = percentage of steps containing friction

    if len(steps) > 0:

        score = round(
            (len(friction_points) / len(steps)) * 100
        )

        score = min(score, 100)

    else:

        score = 0


    # OVERALL RISK

    if score >= 70:

        risk_level = "HIGH"

    elif score >= 40:

        risk_level = "MEDIUM"

    else:

        risk_level = "LOW"


    # RESPONSE

    return jsonify({

        "process_name": process_name,

        "number_of_steps": len(steps),

        "friction_score": score,

        "risk_level": risk_level,

        "friction_points": friction_points

    })


if __name__ == "__main__":

    app.run(debug=True)

