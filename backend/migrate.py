import sqlite3

try:
    conn = sqlite3.connect("d:/Infosys/hire-helper-auth-ui/HireHelper-Batch2/backend/hirehelper.db")
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE task_requests ADD COLUMN message VARCHAR;")
    conn.commit()
    print("✅ Successfully added 'message' column to task_requests table.")
except sqlite3.OperationalError as e:
    print(f"⚠️ Could not add column (it might already exist): {e}")
finally:
    conn.close()
