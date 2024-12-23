const { test, expect } = require('@playwright/test');
const { login } = require('../../Useful-folder/loginhelper');

// Declare shared browser context and page variables
let browserContext;
let sharedPage;

test.beforeAll(async ({ browser }) => {
  // Launch a single browser context and page
  console.log('Starting the browser and logging in...');
  browserContext = await browser.newContext(); // Shared context
  sharedPage = await browserContext.newPage(); // Shared page

  // Perform login once
  await login(sharedPage, 'BriqDevCsv', 1);
  await sharedPage.waitForTimeout(5000); // Allow time for post-login
  await sharedPage.goto('https://app-dev.briq.com/#/home'); // Navigate to the homepage
});

test('SearchFilter', async () => {
  console.log('Executing SearchFilter Test...');
  const page = sharedPage; // Reuse the shared page

  // App switches to AP autopilot
  await page.getByRole('banner').getByRole('button').nth(2).click();
  await page.waitForTimeout(1000);
  await page.getByText('AP Autopilot').click();
  await page.waitForTimeout(2000);

  // Navigate to the Credit Cards section
  await page.getByRole('button', { name: 'Credit Cards' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Credit cards' }).click();
  await page.waitForTimeout(2000);

  // Search filter test
  await page.getByPlaceholder('Search card, Bank name').fill('kashmira');
  await page.waitForTimeout(1000);

  try {
    const cell = await page.getByRole('cell', { name: 'Kashmira Rote Test', exact: true });
    if (await cell.isVisible()) {
      console.log('Text found in the table: Kashmira Rote Test');
    } else {
      console.log('Text not found in the table');
    }
  } catch (error) {
    console.log('Text not found in the table');
  }

  // Clear search
  await page.getByRole('button', { name: '' }).click();
});

test('StatusFilter', async () => {
  console.log('Executing StatusFilter Test...');
  const page = sharedPage; // Reuse the shared page

  // Click on the Status dropdown filter
  await page.getByLabel('Status').click();
  await page.waitForTimeout(1000);

  // Select the "Active" status from the dropdown
  await page.getByRole('option', { name: 'Active', exact: true }).locator('div').first().click();
  await page.waitForTimeout(2000);

  // Wait for the table to update based on the filtering logic
  const visibleRows = await page.locator('table tbody tr');
  const activeRowsCount = await page.locator('table tbody tr:has-text("Active")').count();
  const totalRowsCount = await visibleRows.count();

  // Validate that all rows have "Active" status
  if (activeRowsCount === totalRowsCount) {
    console.log('All rows are Active.');
  } else {
    console.error(`Non-Active rows found. Total: ${totalRowsCount}, Active: ${activeRowsCount}`);
  }

  // Clear the filter
  await page.getByLabel('clear icon').click();
});

test.afterAll(async () => {
  console.log('Tests completed. Closing the browser...');
  await sharedPage.close();
  await browserContext.close();
});
