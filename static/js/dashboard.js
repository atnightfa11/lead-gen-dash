// Dashboard.js - Main JavaScript file for the Digital Marketing Dashboard

// Global variables
let trafficData = [];
let conversionData = [];
let adsData = [];
let spendData = [];
let filteredTrafficData = [];
let filteredConversionData = [];
let filteredAdsData = [];
let filteredSpendData = [];
let startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
let endDate = moment().format('YYYY-MM-DD');

// Global variables for tracking previous values
let previousData = {
    total_sessions: 0,
    total_users: 0,
    total_engaged_sessions: 0,
    avg_engagement_rate: 0,
    total_leads: 0,
    total_goal_completions: 0,
    total_impressions: 0,
    avg_ctr: 0,
    avg_cpc: 0,
    total_spend: 0,
    total_ad_conversions: 0,
    roi: 0
};

// Charts
let trafficChart;
let conversionChart;
let adsChart;
let roiChart;

// Current timeframe setting
let currentTimeframe = 'daily';

// DataTables instances
let trafficTable;
let conversionsTable;
let adsTable;
let spendTable;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date range picker
    initDateRangePicker();
    
    // Fetch data
    fetchAllData();
    
    // Set up export buttons
    document.getElementById('export-pdf').addEventListener('click', exportPDF);
    document.getElementById('export-csv').addEventListener('click', exportCSV);
    
    // Set up timeframe toggle
    document.querySelectorAll('.timeframe-toggle button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.timeframe-toggle button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update timeframe and refresh charts
            currentTimeframe = this.getAttribute('data-timeframe');
            updateCharts();
        });
    });
});

// Initialize date range picker
function initDateRangePicker() {
    $('input[name="daterange"]').daterangepicker({
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end, label) {
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
        filterDataByDateRange();
    });
}

// Fetch all data from the API
function fetchAllData() {
    showLoading();
    
    // Fetch dashboard summary
    fetch('/api/dashboard-summary')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                updateSummary(data);
            }
        })
        .catch(error => {
            showError('Failed to fetch dashboard summary: ' + error);
        });
    
    // Fetch website traffic data
    fetch('/api/website-traffic')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                trafficData = data;
                filterDataByDateRange();
                updateTrafficTable();
            }
        })
        .catch(error => {
            showError('Failed to fetch website traffic data: ' + error);
        });
    
    // Fetch conversion data
    fetch('/api/conversions')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                conversionData = data;
                filterDataByDateRange();
                updateConversionsTable();
            }
        })
        .catch(error => {
            showError('Failed to fetch conversion data: ' + error);
        });
    
    // Fetch Google Ads data
    fetch('/api/google-ads')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                adsData = data;
                filterDataByDateRange();
                updateAdsTable();
            }
        })
        .catch(error => {
            showError('Failed to fetch Google Ads data: ' + error);
        });
    
    // Fetch marketing spend data
    fetch('/api/marketing-spend')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError(data.error);
            } else {
                spendData = data;
                filterDataByDateRange();
                updateSpendTable();
            }
        })
        .catch(error => {
            showError('Failed to fetch marketing spend data: ' + error);
        })
        .finally(() => {
            hideLoading();
        });
}

// Filter data by date range
function filterDataByDateRange() {
    // Filter website traffic data
    filteredTrafficData = trafficData.filter(item => {
        const itemDate = item.Date;
        return itemDate >= startDate && itemDate <= endDate;
    });
    
    // Filter conversion data
    filteredConversionData = conversionData.filter(item => {
        const itemDate = item.Date;
        return itemDate >= startDate && itemDate <= endDate;
    });
    
    // Filter Google Ads data
    filteredAdsData = adsData.filter(item => {
        const itemDate = item.Date;
        return itemDate >= startDate && itemDate <= endDate;
    });
    
    // Filter marketing spend data
    filteredSpendData = spendData.filter(item => {
        const itemDate = item.Date;
        return itemDate >= startDate && itemDate <= endDate;
    });
    
    // Update charts and tables
    updateCharts();
    updateTables();
}

// Update summary metrics
function updateSummary(data) {
    // Calculate trends
    const trends = calculateTrends(data);
    
    // Update metrics with trend indicators
    updateMetricWithTrend('total-sessions', formatNumber(data.total_sessions), trends.total_sessions);
    updateMetricWithTrend('total-users', formatNumber(data.total_users), trends.total_users);
    updateMetricWithTrend('total-engaged-sessions', formatNumber(data.total_engaged_sessions), trends.total_engaged_sessions);
    updateMetricWithTrend('avg-engagement-rate', formatPercentage(data.avg_engagement_rate), trends.avg_engagement_rate);
    updateMetricWithTrend('total-leads', formatNumber(data.total_leads), trends.total_leads);
    updateMetricWithTrend('total-goal-completions', formatNumber(data.total_goal_completions), trends.total_goal_completions);
    updateMetricWithTrend('conversion-rate', formatPercentage(data.total_leads / data.total_sessions * 100), trends.conversion_rate);
    updateMetricWithTrend('total-impressions', formatNumber(data.total_impressions), trends.total_impressions);
    updateMetricWithTrend('avg-ctr', formatPercentage(data.avg_ctr), trends.avg_ctr);
    updateMetricWithTrend('avg-cpc', formatCurrency(data.avg_cpc), trends.avg_cpc, true);
    updateMetricWithTrend('total-spend', formatCurrency(data.total_spend), trends.total_spend, true);
    updateMetricWithTrend('total-ad-conversions', formatNumber(data.total_ad_conversions), trends.total_ad_conversions);
    updateMetricWithTrend('roi', formatPercentage(data.roi), trends.roi);
    
    document.getElementById('last-updated').textContent = data.last_updated;
    
    // Store current values for future trend comparison
    previousData = { ...data };
}

// Calculate trends compared to previous data
function calculateTrends(data) {
    const trends = {};
    
    // For each metric, determine if it's increasing, decreasing, or neutral
    for (const key in data) {
        if (key in previousData) {
            if (data[key] > previousData[key]) {
                trends[key] = 'up';
            } else if (data[key] < previousData[key]) {
                trends[key] = 'down';
            } else {
                trends[key] = 'neutral';
            }
        } else {
            trends[key] = 'neutral';
        }
    }
    
    // Special case for conversion rate
    const currentConversionRate = data.total_leads / data.total_sessions;
    const previousConversionRate = previousData.total_leads / previousData.total_sessions;
    
    if (currentConversionRate > previousConversionRate) {
        trends.conversion_rate = 'up';
    } else if (currentConversionRate < previousConversionRate) {
        trends.conversion_rate = 'down';
    } else {
        trends.conversion_rate = 'neutral';
    }
    
    return trends;
}

// Update a metric with trend indicator
function updateMetricWithTrend(elementId, value, trend, invertColors = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let trendIcon = '';
    let trendClass = '';
    
    // Determine icon and class based on trend
    if (trend === 'up') {
        trendIcon = '<i class="bi bi-arrow-up-circle-fill ms-2"></i>';
        trendClass = invertColors ? 'trend-down' : 'trend-up';
    } else if (trend === 'down') {
        trendIcon = '<i class="bi bi-arrow-down-circle-fill ms-2"></i>';
        trendClass = invertColors ? 'trend-up' : 'trend-down';
    } else {
        trendIcon = '<i class="bi bi-dash-circle-fill ms-2"></i>';
        trendClass = 'trend-neutral';
    }
    
    // Update element with value and trend indicator
    element.innerHTML = value + trendIcon;
    element.className = element.className.replace(/trend-(up|down|neutral)/g, '').trim();
    element.classList.add(trendClass);
}

// Update all charts
function updateCharts() {
    updateTrafficChart();
    updateConversionChart();
    updateAdsChart();
    updateROIChart();
}

// Update all tables
function updateTables() {
    updateTrafficTable();
    updateConversionsTable();
    updateAdsTable();
    updateSpendTable();
}

// Group data by timeframe
function groupDataByTimeframe(data, timeframe) {
    if (timeframe === 'daily' || !data || data.length === 0) {
        return data; // Return as is for daily view
    }
    
    const groupedData = {};
    
    data.forEach(item => {
        const date = moment(item.Date);
        let key;
        
        if (timeframe === 'weekly') {
            // Group by week (using the first day of the week)
            key = date.startOf('week').format('YYYY-MM-DD');
        } else if (timeframe === 'monthly') {
            // Group by month (using the first day of the month)
            key = date.startOf('month').format('YYYY-MM-DD');
        }
        
        if (!groupedData[key]) {
            groupedData[key] = {
                Date: key,
                Sessions: 0,
                Users: 0,
                'Engaged Sessions': 0,
                'Engagement Rate': 0,
                'Average Engagement Time': 0,
                count: 0
            };
        }
        
        // Sum up the values
        groupedData[key].Sessions += item.Sessions || 0;
        groupedData[key].Users += item.Users || 0;
        groupedData[key]['Engaged Sessions'] += item['Engaged Sessions'] || 0;
        groupedData[key]['Engagement Rate'] += item['Engagement Rate'] || 0;
        groupedData[key]['Average Engagement Time'] += item['Average Engagement Time'] || 0;
        groupedData[key].count++;
    });
    
    // Calculate averages for rate-based metrics
    const result = Object.values(groupedData).map(group => {
        return {
            ...group,
            'Engagement Rate': group['Engagement Rate'] / group.count,
            'Average Engagement Time': group['Average Engagement Time'] / group.count
        };
    });
    
    // Sort by date
    return result.sort((a, b) => moment(a.Date).diff(moment(b.Date)));
}

// Update website traffic chart
function updateTrafficChart() {
    const ctx = document.getElementById('traffic-chart').getContext('2d');
    
    // Group data by timeframe
    const groupedData = groupDataByTimeframe(filteredTrafficData, currentTimeframe);
    
    // Prepare data
    const dates = groupedData.map(item => {
        // Format date based on timeframe
        const date = moment(item.Date);
        if (currentTimeframe === 'weekly') {
            return `Week of ${date.format('MMM D')}`;
        } else if (currentTimeframe === 'monthly') {
            return date.format('MMM YYYY');
        }
        return date.format('MMM D');
    });
    
    const sessions = groupedData.map(item => item.Sessions);
    const engagedSessions = groupedData.map(item => item['Engaged Sessions']);
    
    // Destroy existing chart if it exists
    if (trafficChart) {
        trafficChart.destroy();
    }
    
    // Create new chart
    trafficChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Sessions',
                    data: sessions,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Engaged Sessions',
                    data: engagedSessions,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatNumber(context.raw);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Update conversion chart with similar enhancements
function updateConversionChart() {
    const ctx = document.getElementById('conversion-chart').getContext('2d');
    
    // Group data by timeframe
    const groupedData = groupDataByTimeframe(filteredConversionData, currentTimeframe);
    
    // Prepare data
    const dates = groupedData.map(item => {
        // Format date based on timeframe
        const date = moment(item.Date);
        if (currentTimeframe === 'weekly') {
            return `Week of ${date.format('MMM D')}`;
        } else if (currentTimeframe === 'monthly') {
            return date.format('MMM YYYY');
        }
        return date.format('MMM D');
    });
    
    const leads = groupedData.map(item => item.Leads);
    const goalCompletions = groupedData.map(item => item['Goal Completions']);
    
    // Destroy existing chart if it exists
    if (conversionChart) {
        conversionChart.destroy();
    }
    
    // Create new chart
    conversionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Leads',
                    data: leads,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Goal Completions',
                    data: goalCompletions,
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += formatNumber(context.raw);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Update Google Ads chart
function updateAdsChart() {
    const ctx = document.getElementById('ads-chart').getContext('2d');
    
    // Prepare data
    const dates = filteredAdsData.map(item => item.Date);
    const impressions = filteredAdsData.map(item => item.Impressions);
    const clicks = filteredAdsData.map(item => item.Clicks);
    const ctr = filteredAdsData.map(item => item.CTR * 100); // Convert to percentage
    
    // Destroy existing chart if it exists
    if (adsChart) {
        adsChart.destroy();
    }
    
    // Create new chart
    adsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Clicks',
                    data: clicks,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'CTR (%)',
                    data: ctr,
                    type: 'line',
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Clicks'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'CTR (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Update ROI chart
function updateROIChart() {
    const ctx = document.getElementById('roi-chart').getContext('2d');
    
    // Prepare data
    const dates = filteredSpendData.map(item => item.Date);
    const spend = filteredSpendData.map(item => item.Spend);
    const roi = filteredSpendData.map(item => item.ROI);
    
    // Destroy existing chart if it exists
    if (roiChart) {
        roiChart.destroy();
    }
    
    // Create new chart
    roiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Spend',
                    data: spend,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                },
                {
                    label: 'ROI (%)',
                    data: roi,
                    type: 'line',
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    tension: 0.1,
                    fill: false,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Spend ($)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'ROI (%)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Update website traffic table
function updateTrafficTable() {
    const tableBody = document.querySelector('#traffic-table tbody');
    tableBody.innerHTML = '';
    
    filteredTrafficData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Date}</td>
            <td>${formatNumber(item.Sessions)}</td>
            <td>${formatNumber(item.Users)}</td>
            <td>${formatNumber(item['Engaged Sessions'])}</td>
            <td>${formatPercentage(item['Engagement Rate'])}</td>
            <td>${formatTime(item['Average Engagement Time'])}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize or refresh DataTable
    if (trafficTable) {
        trafficTable.destroy();
    }
    
    trafficTable = new DataTable('#traffic-table', {
        order: [[0, 'desc']], // Sort by date descending by default
        responsive: true,
        language: {
            search: "Filter:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries"
        },
        dom: '<"row"<"col-sm-6"l><"col-sm-6"f>><"table-responsive"t><"row"<"col-sm-6"i><"col-sm-6"p>>',
        pageLength: 10
    });
}

// Update conversions table
function updateConversionsTable() {
    const tableBody = document.querySelector('#conversions-table tbody');
    tableBody.innerHTML = '';
    
    filteredConversionData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Date}</td>
            <td>${formatNumber(item.Leads)}</td>
            <td>${formatNumber(item['Goal Completions'])}</td>
            <td>${formatPercentage(item['Conversion Rate'])}</td>
            <td>${item.Source}</td>
            <td>${item.Medium}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize or refresh DataTable
    if (conversionsTable) {
        conversionsTable.destroy();
    }
    
    conversionsTable = new DataTable('#conversions-table', {
        order: [[0, 'desc']], // Sort by date descending by default
        responsive: true,
        language: {
            search: "Filter:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries"
        },
        dom: '<"row"<"col-sm-6"l><"col-sm-6"f>><"table-responsive"t><"row"<"col-sm-6"i><"col-sm-6"p>>',
        pageLength: 10
    });
}

// Update Google Ads table
function updateAdsTable() {
    const tableBody = document.querySelector('#ads-table tbody');
    tableBody.innerHTML = '';
    
    filteredAdsData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Date}</td>
            <td>${item.Campaign}</td>
            <td>${formatNumber(item.Impressions)}</td>
            <td>${formatNumber(item.Clicks)}</td>
            <td>${formatPercentage(item.CTR)}</td>
            <td>${formatCurrency(item.CPC)}</td>
            <td>${formatNumber(item.Conversions)}</td>
            <td>${formatCurrency(item['Cost per Conversion'])}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize or refresh DataTable
    if (adsTable) {
        adsTable.destroy();
    }
    
    adsTable = new DataTable('#ads-table', {
        order: [[0, 'desc']], // Sort by date descending by default
        responsive: true,
        language: {
            search: "Filter:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries"
        },
        dom: '<"row"<"col-sm-6"l><"col-sm-6"f>><"table-responsive"t><"row"<"col-sm-6"i><"col-sm-6"p>>',
        pageLength: 10
    });
}

// Update marketing spend table
function updateSpendTable() {
    const tableBody = document.querySelector('#spend-table tbody');
    tableBody.innerHTML = '';
    
    filteredSpendData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.Date}</td>
            <td>${item.Channel}</td>
            <td>${item.Campaign}</td>
            <td>${formatCurrency(item.Spend)}</td>
            <td>${formatNumber(item.Conversions)}</td>
            <td>${formatCurrency(item['Cost per Conversion'])}</td>
            <td>${formatPercentage(item.ROI)}</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Initialize or refresh DataTable
    if (spendTable) {
        spendTable.destroy();
    }
    
    spendTable = new DataTable('#spend-table', {
        order: [[0, 'desc']], // Sort by date descending by default
        responsive: true,
        language: {
            search: "Filter:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries"
        },
        dom: '<"row"<"col-sm-6"l><"col-sm-6"f>><"table-responsive"t><"row"<"col-sm-6"i><"col-sm-6"p>>',
        pageLength: 10
    });
}

// Export data as PDF
function exportPDF() {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Digital Marketing Performance Report', 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 30);
    
    // Add summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 40);
    
    // Add summary table
    doc.autoTable({
        startY: 45,
        head: [['Metric', 'Value']],
        body: [
            ['Total Sessions', document.getElementById('total-sessions').textContent],
            ['Total Users', document.getElementById('total-users').textContent],
            ['Total Engaged Sessions', document.getElementById('total-engaged-sessions').textContent],
            ['Avg. Engagement Rate', document.getElementById('avg-engagement-rate').textContent],
            ['Total Leads', document.getElementById('total-leads').textContent],
            ['Total Goal Completions', document.getElementById('total-goal-completions').textContent],
            ['Conversion Rate', document.getElementById('conversion-rate').textContent],
            ['Total Impressions', document.getElementById('total-impressions').textContent],
            ['Avg. CTR', document.getElementById('avg-ctr').textContent],
            ['Avg. CPC', document.getElementById('avg-cpc').textContent],
            ['Total Spend', document.getElementById('total-spend').textContent],
            ['Total Ad Conversions', document.getElementById('total-ad-conversions').textContent],
            ['ROI', document.getElementById('roi').textContent]
        ],
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }
    });
    
    // Add website traffic section
    const trafficY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Website Traffic', 14, trafficY);
    
    // Add website traffic table
    const trafficData = [];
    document.querySelectorAll('#traffic-table tbody tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        trafficData.push(rowData);
    });
    
    doc.autoTable({
        startY: trafficY + 5,
        head: [['Date', 'Sessions', 'Users', 'Engaged Sessions', 'Engagement Rate', 'Avg. Engagement Time']],
        body: trafficData,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }
    });
    
    // Add new page if needed
    if (doc.lastAutoTable.finalY > 250) {
        doc.addPage();
    }
    
    // Add Google Ads section
    const adsY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Google Ads Performance', 14, adsY);
    
    // Add Google Ads table
    const adsData = [];
    document.querySelectorAll('#ads-table tbody tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        adsData.push(rowData);
    });
    
    doc.autoTable({
        startY: adsY + 5,
        head: [['Date', 'Campaign', 'Impressions', 'Clicks', 'CTR', 'CPC', 'Conversions', 'Cost per Conversion']],
        body: adsData,
        theme: 'striped',
        headStyles: { fillColor: [44, 62, 80] }
    });
    
    // Save the PDF
    doc.save('marketing-performance-report.pdf');
}

// Export data as CSV
function exportCSV() {
    // Prepare data
    const data = {
        website_traffic: filteredTrafficData,
        conversions: filteredConversionData,
        google_ads: filteredAdsData,
        marketing_spend: filteredSpendData
    };
    
    // Convert to CSV
    let csv = '';
    
    // Website Traffic
    csv += 'Website Traffic\n';
    csv += 'Date,Sessions,Users,Engaged Sessions,Engagement Rate,Avg. Engagement Time\n';
    data.website_traffic.forEach(item => {
        csv += `${item.Date},${item.Sessions},${item.Users},${item['Engaged Sessions']},${item['Engagement Rate']},${item['Average Engagement Time']}\n`;
    });
    
    csv += '\n';
    
    // Conversions
    csv += 'Conversions\n';
    csv += 'Date,Leads,Goal Completions,Conversion Rate,Source,Medium\n';
    data.conversions.forEach(item => {
        csv += `${item.Date},${item.Leads},${item['Goal Completions']},${item['Conversion Rate']},${item.Source},${item.Medium}\n`;
    });
    
    csv += '\n';
    
    // Google Ads
    csv += 'Google Ads Performance\n';
    csv += 'Date,Campaign,Impressions,Clicks,CTR,CPC,Conversions,Cost per Conversion\n';
    data.google_ads.forEach(item => {
        csv += `${item.Date},${item.Campaign},${item.Impressions},${item.Clicks},${item.CTR},${item.CPC},${item.Conversions},${item['Cost per Conversion']}\n`;
    });
    
    csv += '\n';
    
    // Marketing Spend
    csv += 'Marketing Spend\n';
    csv += 'Date,Channel,Campaign,Spend,Conversions,Cost per Conversion,ROI\n';
    data.marketing_spend.forEach(item => {
        csv += `${item.Date},${item.Channel},${item.Campaign},${item.Spend},${item.Conversions},${item['Cost per Conversion']},${item.ROI}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'marketing-performance-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Helper functions
function formatNumber(num) {
    return num.toLocaleString();
}

function formatPercentage(num) {
    return (num * 100).toFixed(2) + '%';
}

function formatCurrency(num) {
    return '$' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

// Loading indicator
function showLoading() {
    // Check if loading element already exists
    if (!document.querySelector('.loading')) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingDiv);
    }
}

function hideLoading() {
    const loadingDiv = document.querySelector('.loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Error handling
function showError(message) {
    console.error(message);
    alert('Error: ' + message);
} 