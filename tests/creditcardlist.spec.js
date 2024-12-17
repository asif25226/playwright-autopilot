const { test, expect } = require('@playwright/test');
const {login} = require('../Useful-folder/loginhelper');
const { only } = require('node:test');

test.beforeEach(async ({ context }) => {
    await context.clearCookies();
    await context.clearPermissions();
  });
  

// Runs before each test in this suite
test.beforeEach(async ({ page }) => {
    await login(page, 'BriqDevCsv', 0); // Login before each test
});

test('Credit card list Search Filter And new added CC', async ({ page }) => {
    
  // Navigate to credit card section
  await page.getByRole('button', { name: 'Credit Cards' }).click();
  await page.waitForTimeout(1500);
  await page.getByRole('link', { name: 'Credit cards' }).click();
  await page.waitForTimeout(5000);
  
  //Search filter Test
        await page.getByPlaceholder('Search card, Bank name').click();
        await page.getByPlaceholder('Search card, Bank name').fill('kashmira');
        await page.waitForTimeout(1500);
        //await page.getByRole('cell', { name: 'Kashmira Rote Test' }).click();

        try {
            // Wait for the table cell containing the searched text to appear
            const cell = await page.getByRole('cell', { name: 'Kashmira Rote Test', exact: true });
        
            // Check if the cell is visible
            if (await cell.isVisible()) {
            console.log('Text found in the table: Kashmira Rote Test');
            } else {
            console.log('Text not found in the table');
            }
        } catch (error) {
            console.log('Text not found in the table');
        }
        await page.getByRole('button', { name: '' }).click(); //Clear Search
        
});

test('Credit card list Status Filter', async({page})=>{
   
    // Navigate to credit card section
    await page.getByRole('button', { name: 'Credit Cards' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('link', { name: 'Credit cards' }).click();
    await page.waitForTimeout(5000);

    //Verifying Status Filter.
        // Click on the Status dropdown filter
        await page.getByLabel('Status').click(); 
        await page.waitForTimeout(1000);

        // Select the "Active" status from the dropdown
        await page.getByRole('option', { name: 'Active', exact: true }).locator('div').first().click();
        await page.waitForTimeout(2500);

        // Wait for the table to update based on the filtering logic
        await page.waitForSelector('table tbody tr');

        // Get all rows currently visible in the table
        const visibleRows = await page.locator('table tbody tr');

        // Count rows that explicitly have "Active" status
        const activeRowsCount = await page.locator('table tbody tr:has-text("Active")').count();

        // Count all visible rows
        const totalRowsCount = await visibleRows.count();

        // Validate if all visible rows have the "Active" status
        if (activeRowsCount === totalRowsCount) {
        console.log('All rows are Active');
        } else {
        console.error(`Non-Active rows found. Total: ${totalRowsCount}, Active: ${activeRowsCount}`);
        }

        // Clear the search filter
        await page.getByLabel('clear icon').click();

        // Wait for the table to reset (optional based on implementation)
        await page.waitForSelector('table tbody tr'); 
})

test('credit card list bank filter', async({page})=>{
    
    // Navigate to credit card section
    await page.getByRole('button', { name: 'Credit Cards' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('link', { name: 'Credit cards' }).click();
    await page.waitForTimeout(5000);

    // Clicking on Bank filter and search for bank
    await page.getByPlaceholder('Filter by bank').click();
    await page.getByPlaceholder('Filter by bank').fill('morgan');
    await page.waitForTimeout(3500);
    const expectedBankName = 'Morgan Stanley'; // Define the expected bank name
    //await page.getByRole('option', { name: expectedBankName }).locator('div').first().click(); //click the search name

     // Dynamically select the first bank name that matches in the dropdown
     const dropdownOption = await page.getByRole('option', { name: expectedBankName }).locator('div').first();
     if (await dropdownOption.isVisible()) {
         await dropdownOption.click();
     } else {
         console.error(`Bank name '${expectedBankName}' not found in the dropdown.`);
         return; // Exit test if bank not found
     }
 

    // Wait for the table to update after filtering
    await page.waitForSelector('table tbody tr');

    // Get all rows of the table
    const rows = await page.locator('table tbody tr');

    // Count total visible rows
    const totalRows = await rows.count();
    console.log(`Total rows found after filter: ${totalRows}`);

    // Loop through all rows and validate the content of the 3rd column
    for (let i = 0; i < totalRows; i++) {
        // Get the text content of the 3rd column in the current row
        const columnText = await rows.nth(i).locator('td:nth-child(3)').innerText();

        // Check if the column text matches the expected bank name
        if (columnText.trim() !== expectedBankName) {
            console.log(`Row ${i + 1}: MISMATCH - Found "${columnText}", expected "${expectedBankName}"`);
        } else {
            console.log(`Row ${i + 1}: PASSED - Correct bank name "${columnText}"`);
        }
    }

    //click on cancel filter icon in bank filters
    await page.locator('div:nth-child(3) > .v-input__control > .v-input__slot > .v-select__slot > div > .v-input__icon > .v-icon').first().click();



})

test.only('Verify the cloumn names', async({page})=>{

    // Navigate to credit card section
    await page.getByRole('button', { name: 'Credit Cards' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('link', { name: 'Credit cards' }).click();
    await page.waitForTimeout(5000);

    /*
    //Checking card column name
    await expect(page.locator('th:has-text("Card")')).toBeVisible();
    await expect(page.locator('th:has-text("Card")')).toContainText();
    await expect(page.locator('th:has-text("Card")')).toHaveText();
    await page.waitForTimeout(500);
     //Checking Bank column name
    await expect(page.locator('th:has-text("Bank")')).toBeVisible();
    await expect(page.locator('th:has-text("Bank")')).toContainText();
    await expect(page.locator('th:has-text("Bank")')).toHaveText();
    await page.waitForTimeout(500);
    //Checking Connection type column name
    await expect(page.locator('th:has-text("Connection type")')).toBeVisible();
    await expect(page.locator('th:has-text("Connection type")')).toContainText();
    await expect(page.locator('th:has-text("Connection type")')).toHaveText();
    await page.waitForTimeout(500);
      //Checking Assigned to column name
    await expect(page.locator('th:has-text("Assigned to")')).toBeVisible();
    await expect(page.locator('th:has-text("Assigned to")')).toContainText();
    await expect(page.locator('th:has-text("Assigned to")')).toHaveText();
    */

  // Define column names
    const columnNames = ["Card", "Bank", "Connection type", "Assigned to"];
    let missingColumns = [];

    // Wait for table to load
    await page.waitForSelector('table'); // Ensure the table exists on the page

    for (const columnName of columnNames) {
        const columnLocator = page.locator(`th:has(span:has-text("${columnName}"))`);

        try {
            console.log(`Checking visibility for column: "${columnName}"`);

            // Explicitly wait for the header to be visible
            await expect(columnLocator).toBeVisible({ timeout: 10000 }); // Increased timeout for slower rendering
            console.log(`Column "${columnName}" is visible.`);

            // Check if the column contains the expected text
            await expect(columnLocator).toContainText(columnName);
            console.log(`Column "${columnName}" contains the expected text.`);
        } catch (error) {
            console.error(`Column "${columnName}" failed checks. Error: ${error.message}`);
            missingColumns.push(columnName);
        }
    }

    // Print summary
    if (missingColumns.length === 0) {
        console.log("All columns are found with text and visibility.");
    } else {
        console.error(`Missing or mismatched columns: ${missingColumns.join(", ")}`);
    }


})
