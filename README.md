# Neon CSV Uploader

This project lets users upload a CSV file and insert its contents into a Neon PostgreSQL table using Netlify Functions.

## 🔧 Setup

1. Clone the repo
2. Run `npm install`
3. Create a table in Neon:

```sql
CREATE TABLE tasks (
  task_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  ac_reg TEXT,
  bay_production TEXT,
  task_name TEXT,
  skill TEXT,
  planned_date DATE,
  revised_date DATE
);
```

4. Add `NEON_DB_URL` to Netlify Environment Variables
5. Deploy and upload your CSVs!