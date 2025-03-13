# Digital Marketing Dashboard Setup Guide

This guide will help you set up and deploy your Digital Marketing Dashboard.

## Project Overview

The Digital Marketing Dashboard is a web application that visualizes Google Ads and Google Analytics data from a Google Sheet. It provides a professional, CEO-ready interface for tracking marketing performance metrics.

## Files and Directories

- `backend/app.py`: The main Flask application that serves the dashboard and API endpoints
- `templates/index.html`: The HTML template for the dashboard
- `static/css/styles.css`: CSS styles for the dashboard
- `static/js/dashboard.js`: JavaScript code for the dashboard functionality
- `requirements.txt`: Python dependencies
- `Procfile`: Configuration for Heroku deployment
- `runtime.txt`: Python version for Heroku
- `.env.sample`: Sample environment variables (rename to `.env` for local development)
- `google_sheets_setup.md`: Guide for setting up Google Sheets API credentials
- `sample_data_structure.md`: Sample data structure for your Google Sheet

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lead-gen-dash
```

### 2. Set Up Google Sheets

1. Create a Google Sheet with the following tabs:
   - Website Traffic
   - Conversions
   - Google Ads Performance
   - Marketing Spend

2. Format your data according to the structure in `sample_data_structure.md`.

3. Follow the instructions in `google_sheets_setup.md` to set up Google Sheets API credentials.

### 3. Local Development

1. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Create a `.env` file with your Google Sheets credentials:

```
GOOGLE_SHEETS_CREDENTIALS=<your-credentials-json>
GOOGLE_SHEET_ID=<your-sheet-id>
```

3. Run the application:

```bash
flask run
```

4. Open your browser and navigate to `http://localhost:5000`.

### 4. Deployment to Heroku

1. Create a Heroku account if you don't have one.

2. Install the Heroku CLI and log in:

```bash
heroku login
```

3. Create a new Heroku app:

```bash
heroku create your-app-name
```

4. Set environment variables:

```bash
heroku config:set GOOGLE_SHEETS_CREDENTIALS=<your-credentials-json>
heroku config:set GOOGLE_SHEET_ID=<your-sheet-id>
```

5. Deploy to Heroku:

```bash
git push heroku main
```

6. Open your app:

```bash
heroku open
```

## Usage

1. Update your Google Sheet with the latest data from Google Ads and Google Analytics.
2. The dashboard will automatically refresh with the latest data.
3. Use the date range filter to view data for specific time periods.
4. Export reports as PDF or CSV for executive review.

## Customization

- To customize the dashboard appearance, modify `static/css/styles.css`.
- To add or modify charts, edit `static/js/dashboard.js`.
- To change the dashboard layout, modify `templates/index.html`.
- To add new data sources or API endpoints, edit `backend/app.py`.

## Troubleshooting

If you encounter issues:

1. Check that your Google Sheet is properly formatted and shared with the service account.
2. Verify that your Google Sheets API credentials are correctly configured.
3. Check the application logs for error messages:

```bash
heroku logs --tail
```

## Support

For additional help, please refer to the documentation or contact the development team. 