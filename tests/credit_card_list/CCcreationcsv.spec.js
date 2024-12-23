import { test, expect } from '@playwright/test';
import fs from 'fs';
import csv from 'csv-parser';

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});


const { login } = require('../../Useful-folder/loginhelper');

// Helper function to read CSV file
async function readCSV(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

test('credit card list bank filter dynamically from CSV', async ({ page }) => {
  const csvPath = 'D:\\Briq Playwright Automation\\Useful-folder\\creditcarddata.csv';

  // Step 1: Read CSV data
  const testData = await readCSV(csvPath);

  console.log(`Total rows in CSV: ${testData.length}`);

  // Example: Select rows dynamically (filter for specific bank)
  const selectedRows = testData.filter((row) => row.Bank === 'Comdata'); //Change the bank name to select the row.

  if (selectedRows.length === 0) {
    console.error('No matching rows found for the given filter.');
    return;
  }

  // Step 2: Login
  await login(page, 'BriqDevCsv', 0);

  // Step 3: Navigate to the credit card section
  await page.getByRole('button', { name: 'Credit Cards' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Credit cards' }).click();
  await page.waitForTimeout(3000);

  // Step 4: Loop through selected rows and test dynamically
  for (const row of selectedRows) {
    console.log(`Testing row: ${JSON.stringify(row)}`);

    // Setup new credit card
    await page.getByRole('button', { name: 'Setup New Card' }).click();
    await page.waitForTimeout(1000);

    await page.getByText('manual setup').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Add bank' }).click();
    await page.waitForTimeout(2500);

    // Fill the form dynamically with CSV data
    await page.getByPlaceholder('Select Bank').click();
    await page.getByPlaceholder('Select Bank').fill(row.Bank);
    await page.waitForTimeout(500);
    await page.getByRole('menuitem', { name: row.Bank }).click();

    await page.getByPlaceholder('Add Last 4 Digits').click();
    await page.getByPlaceholder('Add Last 4 Digits').fill(row['Credit Card Number']);

    await page.getByPlaceholder('Select Assignee').click();
    await page.getByPlaceholder('Select Assignee').fill(row.Assignee);
    await page.getByRole('option', { name: row.Assignee }).click();
    await page.waitForTimeout(500);

    await page.getByRole('button', { name: 'Save Details' }).click();
    await page.waitForTimeout(1000);

    /*
    // Validation of success message
    await expect(page.getByText('Success')).toBeVisible();
    console.log(`Test Passed for Bank: ${row.Bank}, Card: ${row['Card Name']}`);
    */

    await page.getByRole('button', { name: 'Continue' }).click();

    }
});
