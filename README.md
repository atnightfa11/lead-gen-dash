# Digital Marketing Dashboard Template

A professional, interactive dashboard for visualizing digital marketing performance data from Google Analytics 4 and Google Ads.

![Dashboard Preview](dashboard_preview.png)

## Features

- **Interactive Data Visualization**: Charts and graphs for website traffic, conversions, Google Ads performance, and ROI
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Advanced Table Functionality**: Sortable, searchable, and paginated tables with DataTables.js
- **Performance Trend Indicators**: Visual indicators showing performance trends (up/down)
- **Flexible Date Filtering**: Built-in date range picker with presets
- **Data Aggregation Options**: View data by day, week, or month
- **Export Capabilities**: Export reports as PDF or raw data as CSV
- **Bootstrap 5 UI**: Clean, modern interface using Bootstrap 5

## Tech Stack

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript
- **Libraries**:
  - Chart.js for data visualization
  - DataTables.js for interactive tables
  - Moment.js for date handling
  - Bootstrap 5 for UI components
  - jsPDF for PDF export

## Setup Instructions

### 1. Clone the Template

```bash
git clone https://github.com/yourusername/lead-gen-dash.git client-name-dashboard
cd client-name-dashboard
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Google API Credentials

1. Create a `credentials` folder (it's gitignored)
2. Add your Google API credentials JSON file to this folder
3. Update the `config.py` file with the path to your credentials

### 5. Customize for Your Client

- Update the dashboard title in `templates/index.html`
- Modify the color scheme in `static/css/styles.css` if needed
- Adjust the metrics displayed based on client requirements

### 6. Run the Application

```bash
python app.py
```

The dashboard will be available at `http://localhost:5000`

### 7. Deploy to Production

For production deployment, consider using:
- Heroku (easy deployment)
- AWS Elastic Beanstalk
- Google Cloud Run
- Any other platform supporting Python web applications

## Customization Guide

### Adding New Metrics

1. Update the data fetching functions in `data_service.py`
2. Add new metrics to the dashboard summary in `templates/index.html`
3. Create new chart visualizations in `static/js/dashboard.js` if needed

### Changing the Layout

The dashboard uses a Bootstrap grid system. Modify the column classes in `templates/index.html` to adjust the layout.

### Styling Changes

All custom styles are in `static/css/styles.css`. The dashboard uses CSS variables for colors, making it easy to update the color scheme.

## License

MIT License - Feel free to use this template for any client projects.

## Support

For questions or support, please open an issue on GitHub or contact [your-email@example.com]. 