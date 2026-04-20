import { test, expect } from "@playwright/test";

test.describe("CourseShelf App", () => {
  test("1. should allow creating a new course and display it on dashboard", async ({
    page,
  }) => {
    await page.goto("/");

    const uniqueTitle = `E2E Testing 101 ${Date.now()}`;

    // fill out the add course form
    await page.fill('input[name="title"]', uniqueTitle);
    await page.selectOption('select[name="department"]', "CS");
    await page.fill('input[name="term"]', "2026S1");

    await page.click('button[type="submit"]');

    // verify course appears on the dashboard
    await expect(page.locator(`text=${uniqueTitle}`)).toBeVisible();
  });

  test("2. should navigate to course details and add a material", async ({
    page,
  }) => {
    await page.goto("/");

    // create a course
    const timestamp = Date.now();
    await page.fill('input[name="title"]', `Physics ${timestamp}`);
    await page.selectOption('select[name="department"]', "PHYSICS");
    await page.fill('input[name="term"]', "2026W2");
    await page.click('button[type="submit"]');

    // click into the newly created course
    await page.click(`text=Physics ${timestamp}`, { force: true });

    // verify we are on the course detail page
    await expect(
      page.locator("h1", { hasText: `Physics ${timestamp}` }),
    ).toBeVisible();

    // fill out the add material form
    await page.fill('input[name="title"]', "Kinematics Notes");
    await page.selectOption('select[name="type"]', "Lecture Notes");
    await page.fill('input[name="description"]', "First week notes");
    await page.fill('input[name="url"]', "https://example.com/notes");

    await page.getByRole("button", { name: "Add Material" }).click();

    // verify the material was added correctly
    await expect(page.locator("text=Kinematics Notes")).toBeVisible();
    await expect(page.locator('span:has-text("Lecture Notes")')).toBeVisible();
    await expect(page.locator("text=First week notes")).toBeVisible();
  });
});
