import os
import json
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import pandas as pd
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../static', template_folder='../templates')
CORS(app)

# Google Sheets setup
def get_google_sheet_client():
    """Set up and return Google Sheets client."""
    try:
        # Get credentials from environment variable
        credentials_json = os.getenv('GOOGLE_SHEETS_CREDENTIALS')
        if not credentials_json:
            raise ValueError("Google Sheets credentials not found in environment variables")
        
        credentials_dict = json.loads(credentials_json)
        scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        credentials = ServiceAccountCredentials.from_json_keyfile_dict(credentials_dict, scope)
        client = gspread.authorize(credentials)
        return client
    except Exception as e:
        app.logger.error(f"Error setting up Google Sheets client: {str(e)}")
        return None

def get_sheet_data(tab_name):
    """Get data from a specific tab in the Google Sheet."""
    try:
        client = get_google_sheet_client()
        if not client:
            return {"error": "Failed to connect to Google Sheets"}
        
        sheet_id = os.getenv('GOOGLE_SHEET_ID')
        if not sheet_id:
            return {"error": "Google Sheet ID not found in environment variables"}
        
        sheet = client.open_by_key(sheet_id).worksheet(tab_name)
        data = sheet.get_all_records()
        return data
    except Exception as e:
        app.logger.error(f"Error getting sheet data: {str(e)}")
        return {"error": f"Failed to get data from {tab_name}: {str(e)}"}

@app.route('/')
def index():
    """Render the main dashboard page."""
    return render_template('index.html')

@app.route('/api/website-traffic')
def website_traffic():
    """Get website traffic data."""
    data = get_sheet_data('Website Traffic')
    return jsonify(data)

@app.route('/api/conversions')
def conversions():
    """Get conversion data."""
    data = get_sheet_data('Conversions')
    return jsonify(data)

@app.route('/api/google-ads')
def google_ads():
    """Get Google Ads performance data."""
    data = get_sheet_data('Google Ads Performance')
    return jsonify(data)

@app.route('/api/marketing-spend')
def marketing_spend():
    """Get marketing spend data."""
    data = get_sheet_data('Marketing Spend')
    return jsonify(data)

@app.route('/api/dashboard-summary')
def dashboard_summary():
    """Get a summary of all dashboard data."""
    try:
        # Get data from all sheets
        traffic_data = get_sheet_data('Website Traffic')
        conversion_data = get_sheet_data('Conversions')
        ads_data = get_sheet_data('Google Ads Performance')
        spend_data = get_sheet_data('Marketing Spend')
        
        # Check for errors
        for data, name in [(traffic_data, 'Website Traffic'), 
                          (conversion_data, 'Conversions'), 
                          (ads_data, 'Google Ads Performance'), 
                          (spend_data, 'Marketing Spend')]:
            if isinstance(data, dict) and 'error' in data:
                return jsonify(data)
        
        # Calculate summary metrics
        summary = {
            'total_sessions': sum(item.get('Sessions', 0) for item in traffic_data),
            'total_users': sum(item.get('Users', 0) for item in traffic_data),
            'total_engaged_sessions': sum(item.get('Engaged Sessions', 0) for item in traffic_data),
            'avg_engagement_rate': sum(item.get('Engagement Rate', 0) for item in traffic_data) / len(traffic_data) if traffic_data else 0,
            'avg_engagement_time': sum(item.get('Average Engagement Time', 0) for item in traffic_data) / len(traffic_data) if traffic_data else 0,
            'total_leads': sum(item.get('Leads', 0) for item in conversion_data),
            'total_goal_completions': sum(item.get('Goal Completions', 0) for item in conversion_data),
            'total_impressions': sum(item.get('Impressions', 0) for item in ads_data),
            'avg_ctr': sum(item.get('CTR', 0) for item in ads_data) / len(ads_data) if ads_data else 0,
            'avg_cpc': sum(item.get('CPC', 0) for item in ads_data) / len(ads_data) if ads_data else 0,
            'total_ad_conversions': sum(item.get('Conversions', 0) for item in ads_data),
            'total_spend': sum(item.get('Spend', 0) for item in spend_data),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # Calculate ROI if possible
        if summary['total_spend'] > 0:
            summary['roi'] = (summary['total_ad_conversions'] / summary['total_spend']) * 100
        else:
            summary['roi'] = 0
            
        return jsonify(summary)
    except Exception as e:
        app.logger.error(f"Error generating dashboard summary: {str(e)}")
        return jsonify({"error": f"Failed to generate dashboard summary: {str(e)}"})

@app.route('/api/export-data')
def export_data():
    """Export all data as CSV."""
    try:
        # Get data from all sheets
        traffic_data = get_sheet_data('Website Traffic')
        conversion_data = get_sheet_data('Conversions')
        ads_data = get_sheet_data('Google Ads Performance')
        spend_data = get_sheet_data('Marketing Spend')
        
        # Check for errors
        for data, name in [(traffic_data, 'Website Traffic'), 
                          (conversion_data, 'Conversions'), 
                          (ads_data, 'Google Ads Performance'), 
                          (spend_data, 'Marketing Spend')]:
            if isinstance(data, dict) and 'error' in data:
                return jsonify(data)
        
        # Combine all data
        export_data = {
            'website_traffic': traffic_data,
            'conversions': conversion_data,
            'google_ads': ads_data,
            'marketing_spend': spend_data
        }
        
        return jsonify(export_data)
    except Exception as e:
        app.logger.error(f"Error exporting data: {str(e)}")
        return jsonify({"error": f"Failed to export data: {str(e)}"})

# Serve React static files
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('../static', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False) 