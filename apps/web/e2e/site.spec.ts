import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("home page loads with hero and featured projects", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/신호정/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "프로젝트 보기" })).toBeVisible();
  });

  test("nav links reach projects, about, and ask", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects\/$/);

    await page.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole("heading", { name: "특허" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "경력" })).toBeVisible();

    await page.getByRole("link", { name: "Ask AI" }).click();
    await expect(page).toHaveURL(/\/ask\/$/);
  });

  test("project card navigates to a detail page with L2/L3 sections", async ({ page }) => {
    await page.goto("/projects/");
    await page.getByRole("link", { name: /아바타 순차 생성/ }).first().click();
    await expect(page).toHaveURL(/avatar-sequential-generation/);
    await expect(page.getByRole("heading", { name: "문제" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "역할" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technical Deep Dive" })).toBeVisible();
  });

  test("project without a deep dive renders L2 only, with repo link when present", async ({ page }) => {
    await page.goto("/projects/savers-disaster-evacuation/");
    await expect(page.getByRole("heading", { name: "문제" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "성과" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub 저장소" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technical Deep Dive" })).toHaveCount(0);
  });

  test("unknown route renders the 404 page", async ({ page }) => {
    const response = await page.goto("/no-such-page/");
    expect(response?.status()).toBe(404);
  });
});

test.describe("theme toggle", () => {
  test("switches between light and dark and persists across reload", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");

    await page.getByRole("radio", { name: "Dark" }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("radio", { name: "Light" }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("ask page layout", () => {
  test("chat panel has no horizontal overflow and controls are present", async ({ page }) => {
    // Regression test for the tall-narrow-viewport scroll bug: the message
    // list must be independently scrollable (min-h-0), not the whole page.
    await page.setViewportSize({ width: 390, height: 1200 });
    await page.goto("/ask/");

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);

    await expect(page.getByPlaceholder("질문을 입력하세요…")).toBeVisible();
    const sendButton = page.getByRole("button", { name: "보내기" });
    await expect(sendButton).toBeDisabled();

    await page.getByPlaceholder("질문을 입력하세요…").fill("테스트 질문");
    await expect(sendButton).toBeEnabled();
  });
});
