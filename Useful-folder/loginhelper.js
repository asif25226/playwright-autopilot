// Common Login
const { expect } = require('@playwright/test'); // Add this line to use 'expect'
const fs = require('fs');
const csv = require('csv-parser');

// Path to the CSV file
const csvFilePath = 'D:/Briq Playwright Automation/Useful-folder/logincredential.csv';

// Function to read credentials from CSV based on row index
async function readCredentials(filePath, rowIndex = 0) {
    const credentials = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                credentials.push(row); // Push each row { email, password } into the array
            })
            .on('end', () => {
                if (credentials[rowIndex]) {
                    resolve(credentials[rowIndex]); // Return the row at the specified index
                } else {
                    reject(new Error(`Row ${rowIndex} does not exist in the CSV file.`));
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Login Function
const login = async (page, env, rowIndex = 0) => {
    let url;

    if (env === 'BriqDev') {
        
        url = 'https://app-dev.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(5000);
        await page.getByLabel('Email').fill('qaautomation.briq@gmail.com');
        //await page.getByLabel('Password').fill('qaautomation');
        await page.locator('id=login-page-password-input').fill('qaautomation');
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();
        await page.waitForTimeout(9000); // Allow time for post-verification process
  
        await page.goto('https://app-dev.briq.com/#/home'); // Dev Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);
       

    } else if (env === 'BriqDevCsv') {
        
        const { email, password } = await readCredentials(csvFilePath, rowIndex);
        url = 'https://app-dev.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(5000);
        await page.getByLabel('Email').fill(email);
        //await page.getByLabel('Password').fill(password);
        await page.locator('id=login-page-password-input').fill(password);
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();

        await page.waitForTimeout(9000); // Allow time for post-verification process
  
        await page.goto('https://app-dev.briq.com/#/home'); // Dev Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);

    } else if (env === 'BriqStage') {
        url = 'https://app-stage.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(5000);
        await page.getByLabel('Email').fill('qaautomation.briq@gmail.com');
        //await page.getByLabel('Password').fill('qaautomation');
        await page.locator('id=login-page-password-input').fill('qaautomation');
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();

        await page.waitForTimeout(10000); // Allow time for post-verification process
  
        await page.goto('https://app-stage.briq.com/#/home'); // Stage Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);

    } else if (env === 'BriqStageCsv') {
        const { email, password } = await readCredentials(csvFilePath, rowIndex);
        url = 'https://app-stage.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(5000);
        await page.getByLabel('Email').fill(email);
        //await page.getByLabel('Password').fill(password);
        await page.locator('id=login-page-password-input').fill(password);
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();

        await page.waitForTimeout(10000); // Allow time for post-verification process
  
        await page.goto('https://app-stage.briq.com/#/home'); // Stage Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);

    } else if (env === 'BriqLive') {
        
        url = 'https://app.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(8000);
        await page.getByLabel('Email').fill('jhamajhamkhel@gmail.com');
        //await page.getByLabel('Password').fill('password1');
        await page.locator('id=login-page-password-input').fill('password1');
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();

        const twoFaModal = page.locator('.two-fa-modal');
        await expect(twoFaModal).toBeVisible();
        await page.waitForTimeout(25000); // Manual OTP entry
        await page.locator('.verify-otp > .v-btn').click();
        
        await page.waitForTimeout(10000); // Allow time for post-verification process
  
       await page.goto('https://app.briq.com/#/home'); // Live Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);

    } else if (env === 'BriqLiveCsv') {
        
        const credentials = await readCredentials(csvFilePath); // Fetch credentials dynamically
        //const email = credentials.email; // Ensure CSV has 'email' and 'password' columns
        //const password = credentials.password;
        const { email, password } = await readCredentials(csvFilePath, rowIndex);
        url = 'https://app.briq.com/#/pages/login';
        await page.goto(url);
        await page.waitForTimeout(8000);
        await page.getByLabel('Email').fill(email);
        //await page.getByLabel('Password').fill(password);
        await page.locator('id=login-page-password-input').fill(password);
        await page.getByRole('button', { name: 'SIGN IN', exact: true }).click();

        const twoFaModal = page.locator('.two-fa-modal');
        await expect(twoFaModal).toBeVisible();
        await page.waitForTimeout(25000);
        await page.locator('.verify-otp > .v-btn').click();
        
        await page.waitForTimeout(10000); // Allow time for post-verification process
  
        await page.goto('https://app.briq.com/#/home'); // Live Landing on home page
        await page.waitForTimeout(7500);
       
        // App switches to AP autopilot
        await page.getByRole('banner').getByRole('button').nth(2).click();
        //await page.pause();
        await page.waitForTimeout(1000);
        await page.getByText('AP Autopilot').click();
        await page.waitForTimeout(3500);
    }
};

module.exports = { login };
