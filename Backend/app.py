from flask import Flask, send_file, jsonify
import csv
from fpdf import FPDF
from shoutouts_data import shoutouts
import os

app = Flask(__name__)

EXPORT_FOLDER = "exports"
os.makedirs(EXPORT_FOLDER, exist_ok=True)

# -------------------------------
# EXPORT CSV
# -------------------------------
@app.route("/api/shoutouts/export/csv", methods=["GET"])
def export_csv():
    file_path = os.path.join(EXPORT_FOLDER, "shoutouts.csv")

    with open(file_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)

        writer.writerow(["ID", "From", "To", "Message", "Date"])

        for s in shoutouts:
            writer.writerow([s["id"], s["from_user"], s["to_user"], s["message"], s["date"]])

    return send_file(file_path, as_attachment=True, mimetype="text/csv")


# -------------------------------
# EXPORT PDF
# -------------------------------
@app.route("/api/shoutouts/export/pdf", methods=["GET"])
def export_pdf():
    file_path = os.path.join(EXPORT_FOLDER, "shoutouts.pdf")

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, txt="Shoutouts Report", ln=True, align="C")

    for s in shoutouts:
        pdf.ln()
        pdf.cell(200, 10, txt=f"From: {s['from_user']}", ln=True)
        pdf.cell(200, 10, txt=f"To: {s['to_user']}", ln=True)
        pdf.multi_cell(200, 10, txt=f"Message: {s['message']}")
        pdf.cell(200, 10, txt=f"Date: {s['date']}", ln=True)

    pdf.output(file_path)

    return send_file(file_path, as_attachment=True, mimetype="application/pdf")


@app.route("/")
def home():
    return jsonify({"message": "Shoutouts Export API Running!"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
