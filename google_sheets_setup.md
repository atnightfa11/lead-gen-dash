# Setting Up Google Sheets API Credentials

This guide will walk you through the process of setting up Google Sheets API credentials to connect your Google Sheet to the Digital Marketing Dashboard.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top of the page and select "New Project".
3. Enter a name for your project (e.g., "Marketing Dashboard") and click "Create".
4. Wait for the project to be created, then select it from the project dropdown.

## Step 2: Enable the Google Sheets API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library" from the left sidebar.
2. Search for "Google Sheets API" and click on it.
3. Click the "Enable" button to enable the API for your project.

## Step 3: Create Service Account Credentials

1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials" from the left sidebar.
2. Click on "Create Credentials" and select "Service Account".
3. Enter a name for your service account (e.g., "Marketing Dashboard Service Account").
4. Optionally, add a description.
5. Click "Create and Continue".
6. For the "Role" dropdown, select "Project" > "Editor" to give the service account edit access.
7. Click "Continue" and then "Done".

## Step 4: Generate a JSON Key

1. On the Credentials page, find the service account you just created and click on it.
2. Go to the "Keys" tab.
3. Click "Add Key" and select "Create new key".
4. Choose "JSON" as the key type and click "Create".
5. The JSON key file will be downloaded to your computer. Keep this file secure as it contains sensitive information.

## Step 5: Share Your Google Sheet

1. Open your Google Sheet that contains your marketing data.
2. Click the "Share" button in the top-right corner.
3. In the "Add people and groups" field, enter the email address of your service account. This email can be found in the JSON key file under the `client_email` field.
4. Make sure the service account has "Editor" access.
5. Uncheck the "Notify people" option.
6. Click "Share".

## Step 6: Configure Your Dashboard

1. Open the `.env` file in your dashboard project.
2. Set the `GOOGLE_SHEETS_CREDENTIALS` variable to the contents of your JSON key file. Make sure to format it as a valid JSON string.
3. Set the `GOOGLE_SHEET_ID` variable to your Google Sheet ID. This is the long string of characters in the URL of your Google Sheet between `/d/` and `/edit`.

Example `.env` file:

```
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"your-project-id","private_key_id":"your-private-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----\n","client_email":"your-service-account@your-project-id.iam.gserviceaccount.com","client_id":"your-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project-id.iam.gserviceaccount.com"}
GOOGLE_SHEET_ID=your-google-sheet-id
```

## Step 7: Deploy to Heroku

When deploying to Heroku, you'll need to set these environment variables in your Heroku app settings:

1. Go to your Heroku dashboard and select your app.
2. Go to the "Settings" tab.
3. Click on "Reveal Config Vars".
4. Add the following config vars:
   - `GOOGLE_SHEETS_CREDENTIALS`: The contents of your JSON key file
   - `GOOGLE_SHEET_ID`: Your Google Sheet ID

## Troubleshooting

If you encounter issues connecting to your Google Sheet:

1. Make sure the Google Sheets API is enabled for your project.
2. Verify that you've shared your Google Sheet with the correct service account email.
3. Check that your JSON credentials are correctly formatted in your environment variables.
4. Ensure your Google Sheet has the correct tab names and column headers as specified in the sample data structure.

For security reasons, never commit your JSON key file or `.env` file to version control. Always use environment variables for sensitive information. 