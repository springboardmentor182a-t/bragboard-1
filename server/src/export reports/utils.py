<<<<<<< HEAD
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import io
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password functions
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Export functions
def export_shoutouts_csv(shoutouts):
    df = pd.DataFrame(shoutouts)
    return df.to_csv(index=False)

def export_shoutouts_pdf(shoutouts):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer)
    data = [list(shoutouts[0].keys())]  # header
    for s in shoutouts:
        data.append(list(s.values()))
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0), colors.gray),
        ('TEXTCOLOR',(0,0),(-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
    ]))
    doc.build([table])
    buffer.seek(0)
    return buffer
=======
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
import io
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password functions
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Export functions
def export_shoutouts_csv(shoutouts):
    df = pd.DataFrame(shoutouts)
    return df.to_csv(index=False)

def export_shoutouts_pdf(shoutouts):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer)
    data = [list(shoutouts[0].keys())]  # header
    for s in shoutouts:
        data.append(list(s.values()))
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,0), colors.gray),
        ('TEXTCOLOR',(0,0),(-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
    ]))
    doc.build([table])
    buffer.seek(0)
    return buffer
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
