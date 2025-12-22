import csv
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

DATA = [
    {"id": 1, "employee": "Alice", "message": "Great teamwork!", "status": "Approved"},
    {"id": 2, "employee": "Bob", "message": "Excellent delivery", "status": "Pending"},
]

def export_csv():
    file_path = "shoutouts_report.csv"
    with open(file_path, mode="w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=DATA[0].keys())
        writer.writeheader()
        writer.writerows(DATA)
    return file_path

def export_pdf():
    file_path = "shoutouts_report.pdf"
    c = canvas.Canvas(file_path, pagesize=A4)
    text = c.beginText(40, 800)

    text.setFont("Helvetica", 11)
    text.textLine("Shoutouts Report")
    text.textLine("-" * 50)

    for item in DATA:
        text.textLine(f"ID: {item['id']}")
        text.textLine(f"Employee: {item['employee']}")
        text.textLine(f"Message: {item['message']}")
        text.textLine(f"Status: {item['status']}")
        text.textLine(" ")

    c.drawText(text)
    c.save()
    return file_path
