const { chromium } = require('playwright');
(async () => {

  // Launch browser
  const browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  // Go to the login page
  await page.goto('https://app-dev.briq.com/#/pages/login');

  await page.waitForTimeout(6000);

  // Perform login
  await page.fill('input#login-page-email-input', 'qaautomation.briq@gmail.com');  // username
  await page.fill('input#login-page-password-input', 'qaautomation');                                     //password

  await page.click('button.login-button');               //login button selector
  await page.waitForTimeout(36000);
  await page.click("//div[text()='Invoices ']");
  await page.waitForTimeout(12000);
  await page.fill('input[type="text"]', 'AutomationTesting-v2');
  await page.waitForTimeout(6000);
  await page.click(".v-card.v-card--link.v-sheet");
  await page.waitForTimeout(15000);
  
  await page.getByLabel('Toggle Row Selection').check();
  await page.waitForTimeout(6000);
  await page.getByText('Wesco.pdf').click();
  await page.waitForTimeout(35000);
  await page.locator("//input[@name='Job_Name__custom']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(6000);
  await page.fill('//input[@name="Job_Name__custom"]', 'Sanket Test');
  await page.waitForTimeout(6000);
  await page.click("//span[text()=' Save ']");
  
  await page.getByText('QA Automation').click();
  await page.waitForTimeout(6000);
  await page.getByText('Log out').click();
  await page.waitForTimeout(6000);
  await browser.close();
})();


//div[text()='Credit Cards']