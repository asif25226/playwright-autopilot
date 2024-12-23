import { test, expect } from '@playwright/test';
const {login} = require('../../Useful-folder/loginhelper');

test.beforeEach(async ({ context }) => {
  await context.clearCookies();
  await context.clearPermissions();
});


test('manual Credit card creation without verification', async ({ page }) => {

  // Test 1: Login Perform
  // Navigate to the login page
  await login(page, 'BriqDevCsv', 0); // Change 'BriqDev' to 'BriqStage', or 'BriqLive' as needed

  // Navigate to credit card section
  await page.getByRole('button', { name: 'Credit Cards' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Credit cards' }).click();
  await page.waitForTimeout(3000);

  //Setuping new credit card
  await page.getByRole('button', { name: 'Setup New Card' }).click();
  await page.waitForTimeout(1000);

  await page.getByText('manual setup').click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Add bank' }).click();
  await page.waitForTimeout(2500);

  //Filling Credit card form
  await page.getByPlaceholder('Select Bank').click();
  await page.getByPlaceholder('Select Bank').fill('morgan ');
  await page.waitForTimeout(500);
  await page.getByRole('menuitem', { name: 'Morgan Stanley' }).click();

  //await page.locator('div:nth-child(3) > .v-input > .v-input__control > .v-input__slot').click();
  //await page.locator('div:has(label:has-text("Card Name")) input[placeholder="Add Name"]').fill('Test Card Name');
  //await page.locator('input[placeholder="Add Name"]').nth(3).fill('Test Card Name');
  //await page.locator('#input-467').fill('Master Card'); //Dev input parameter


  await page.getByPlaceholder('Add Last 4 Digits').click();
  await page.getByPlaceholder('Add Last 4 Digits').fill('1111');

  //await page.locator('.d-flex > div:nth-child(2) > .v-input > .v-input__control > .v-input__slot').click();
  //await page.locator('div:has(label:has-text("Card Holder Name")) input[placeholder="Add Name"]').fill('Test Card Holder Name');
  //await page.locator('input[placeholder="Add Name"]').nth(1).fill('Test Card Holder Name');
  //await page.locator('#input-473').fill('Asif Test'); //Dev input parameter

  await page.getByPlaceholder('Select Assignee').click();
  await page.getByPlaceholder('Select Assignee').fill('Asif ');
  await page.getByRole('option', { name: 'Asif Nazir' }).click();
  await page.waitForTimeout(500);
  
  await page.getByRole('button', { name: 'Save Details' }).click();
  await page.waitForTimeout(500);

  await page.getByText('Success', { exact: true }).click();
  //await expect(page.getByText('Success')).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).click();

});
  
