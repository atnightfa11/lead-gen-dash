# Sample Google Sheets Data Structure

This document provides a sample structure for your Google Sheets data to work with the Digital Marketing Dashboard. The dashboard expects four tabs in your Google Sheet, each with specific columns as outlined below.

## Tab 1: Website Traffic

This tab should contain website traffic data from Google Analytics 4.

| Date | Sessions | Users | Engaged Sessions | Engagement Rate | Average Engagement Time |
|------|----------|-------|-----------------|-----------------|-------------------------|
| 2023-01-01 | 1250 | 980 | 750 | 0.60 | 65 |
| 2023-01-02 | 1300 | 1050 | 820 | 0.63 | 72 |
| ... | ... | ... | ... | ... | ... |

- **Date**: Format as YYYY-MM-DD
- **Sessions**: Number of sessions
- **Users**: Number of unique users
- **Engaged Sessions**: Number of sessions that lasted longer than 10 seconds, had a conversion event, or had 2+ page views
- **Engagement Rate**: Decimal format (e.g., 0.60 for 60%)
- **Average Engagement Time**: In seconds

## Tab 2: Conversions

This tab should contain conversion data from your website.

| Date | Leads | Goal Completions | Conversion Rate | Source | Medium |
|------|-------|------------------|----------------|--------|--------|
| 2023-01-01 | 25 | 35 | 0.02 | google | organic |
| 2023-01-01 | 18 | 22 | 0.015 | google | cpc |
| ... | ... | ... | ... | ... | ... |

- **Date**: Format as YYYY-MM-DD
- **Leads**: Number of leads generated
- **Goal Completions**: Number of goal completions
- **Conversion Rate**: Decimal format (e.g., 0.02 for 2%)
- **Source**: Traffic source (e.g., google, facebook, direct)
- **Medium**: Traffic medium (e.g., organic, cpc, email)

## Tab 3: Google Ads Performance

This tab should contain performance data from Google Ads.

| Date | Campaign | Impressions | Clicks | CTR | CPC | Conversions | Cost per Conversion |
|------|----------|-------------|--------|-----|-----|-------------|-------------------|
| 2023-01-01 | Brand Campaign | 5000 | 250 | 0.05 | 1.25 | 15 | 20.83 |
| 2023-01-01 | Generic Keywords | 8000 | 320 | 0.04 | 1.75 | 12 | 46.67 |
| ... | ... | ... | ... | ... | ... | ... | ... |

- **Date**: Format as YYYY-MM-DD
- **Campaign**: Name of the campaign
- **Impressions**: Number of ad impressions
- **Clicks**: Number of ad clicks
- **CTR**: Click-through rate in decimal format (e.g., 0.05 for 5%)
- **CPC**: Cost per click in dollars
- **Conversions**: Number of conversions from ads
- **Cost per Conversion**: Cost per conversion in dollars

## Tab 4: Marketing Spend

This tab should contain marketing spend data across all channels.

| Date | Channel | Campaign | Spend | Conversions | Cost per Conversion | ROI |
|------|---------|----------|-------|-------------|-------------------|-----|
| 2023-01-01 | Google Ads | Brand Campaign | 312.50 | 15 | 20.83 | 2.5 |
| 2023-01-01 | Google Ads | Generic Keywords | 560.00 | 12 | 46.67 | 1.2 |
| 2023-01-01 | Facebook | Retargeting | 250.00 | 8 | 31.25 | 1.8 |
| ... | ... | ... | ... | ... | ... | ... |

- **Date**: Format as YYYY-MM-DD
- **Channel**: Marketing channel (e.g., Google Ads, Facebook, LinkedIn)
- **Campaign**: Name of the campaign
- **Spend**: Amount spent in dollars
- **Conversions**: Number of conversions
- **Cost per Conversion**: Cost per conversion in dollars
- **ROI**: Return on investment as a decimal (e.g., 2.5 means 250% ROI)

## Important Notes

1. Make sure the tab names in your Google Sheet exactly match: "Website Traffic", "Conversions", "Google Ads Performance", and "Marketing Spend".
2. The first row in each tab should contain the column headers exactly as shown above.
3. Dates should be consistently formatted as YYYY-MM-DD for proper filtering.
4. Percentage values should be in decimal format (e.g., 0.05 for 5%).
5. Ensure your Google Sheet is shared with the service account email from your Google API credentials. 