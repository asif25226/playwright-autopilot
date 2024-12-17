import { test, expect } from '@playwright/test';
import fs from 'fs';
import csv from 'csv-parser';

const { login } = require('../Useful-folder/loginhelper');

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

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});

test('Credit card creation and verify in table', async ({ page }) => {
  const csvPath = 'D:\\Briq Playwright Automation\\Useful-folder\\creditcarddata.csv';

  // Step 1: Read CSV data
  const testData = await readCSV(csvPath);

  console.log(`Total rows in CSV: ${testData.length}`);

  // Example: Select rows dynamically (filter for specific bank)
  const selectedRows = testData.filter((row) => row.Bank === 'Comdata'); // Change the bank name to select the row.

  if (selectedRows.length === 0) {
    console.error('No matching rows found for the given filter.');
    return;
  }

  // Step 2: Login
  await login(page, 'BriqLiveCsv', 1);

  // Step 3: Navigate to the credit card section
  await page.getByRole('button', { name: 'Credit Cards' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Credit cards' }).click();
  await page.waitForTimeout(3000);

  // Step 4: Loop through selected rows, create a credit card, and verify
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

    // Validate success message (Optional)
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);

    // Refresh the page to load the new credit card in the table
    await page.reload();
    await page.waitForTimeout(3500); // Wait for the page to reload completely

    // Step 5: Verify the created credit card in the table
    console.log(`Verifying credit card in the table for: Bank=${row.Bank}, Card Last 4 Digits=${row['Credit Card Number']}`);
    
    // Search the credit card in the list
    await page.getByPlaceholder('Search card, Bank name').click();
    await page.getByPlaceholder('Search card, Bank name').fill(row['Credit Card Number']);
    await page.waitForTimeout(1500);

    try {
      // Wait for the table cell containing the searched text to appear
      const cell = await page.getByRole('cell', { name: row['Credit Card Number'], exact: true });

      // Check if the cell is visible
      if (await cell.isVisible()) {
        console.log(`Credit card found in the table: ${row['Credit Card Number']}`);
      } else {
        console.error(`Credit card not found in the table: ${row['Credit Card Number']}`);
      }
    } catch (error) {
      console.error(`Credit card not found in the table: ${row['Credit Card Number']}`);
    }

    // Clear the search input
    await page.getByRole('button', { name: '' }).click(); // Clear search
    await page.waitForTimeout(500);
  }
});
