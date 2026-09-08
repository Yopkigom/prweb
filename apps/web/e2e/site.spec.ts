import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("home shows the sticky headline and the Showcase sheet", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/신호정/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Unity 16년/);
    await expect(page.getByRole("heading", { name: "Introduction" })).toBeVisible();
    // Showcase is the landing section and its button is the active one.
    await expect(page.getByRole("link", { name: "쇼케이스" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: /^Showcase/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^Overview/ })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^Projects/ })).toHaveCount(0);
    // The old top menu and theme toggle are gone.
    await expect(page.getByRole("radiogroup")).toHaveCount(0);
  });

  test("header buttons reach projects, about, and ask with active state", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "프로젝트", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/$/);
    await expect(page.getByRole("link", { name: "프로젝트", exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await page.getByRole("link", { name: "경력 · 특허 · 수상" }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole("heading", { name: /^Overview/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /특허/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /경력/ })).toBeVisible();

    await page.getByRole("link", { name: "Ask AI에게 질문하기" }).click();
    await expect(page).toHaveURL(/\/ask\/$/);
    await expect(page.getByRole("link", { name: "Ask AI에게 질문하기" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("projects page lists featured and more groups that link to detail pages", async ({ page }) => {
    await page.goto("/projects/");
    await expect(page.getByRole("heading", { name: /^Projects/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /^More/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Unity 온디바이스 RAG 앱/ })).toHaveAttribute(
      "href",
      "/projects/unity-ondevice-rag/"
    );
  });

  test("project row navigates to a detail page with L2/L3 sections", async ({ page }) => {
    await page.goto("/projects/");
    await page.getByRole("link", { name: /아바타 순차 생성/ }).first().click();
    await expect(page).toHaveURL(/avatar-sequential-generation/);
    await expect(page.getByRole("heading", { name: "문제" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "역할" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Key Numbers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technical Deep Dive" })).toBeVisible();
  });

  test("project without a deep dive renders L2 only, with repo link when present", async ({ page }) => {
    await page.goto("/projects/savers-disaster-evacuation/");
    await expect(page.getByRole("heading", { name: "문제" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "성과" })).toBeVisible();
    await expect(page.getByRole("link", { name: "GitHub 저장소" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Technical Deep Dive" })).toHaveCount(0);
  });

  test("home shows the showcase with a repo card and two click-to-play videos", async ({ page }) => {
    await page.goto("/");
    // Facade: no YouTube iframe (and no third-party request) until play is pressed.
    const playButtons = page.getByRole("button", { name: /영상 재생$/ });
    await expect(playButtons).toHaveCount(2);
    await expect(page.locator("iframe[src*=\"youtube-nocookie.com/embed/\"]")).toHaveCount(0);
    await playButtons.first().click();
    await expect(page.locator("iframe[src*=\"youtube-nocookie.com/embed/E51utCQPQYk\"]")).toHaveCount(1);
    await expect(page.getByRole("button", { name: /영상 재생$/ })).toHaveCount(1);
    await expect(page.getByRole("link", { name: /광고 소재 생성 서비스 결과물/ })).toHaveAttribute(
      "href",
      /github\.com/
    );
  });

  test("header offers the resume PDF download with a Korean file name", async ({ page }) => {
    await page.goto("/about/");
    const link = page.getByRole("link", { name: "이력서 PDF 다운로드" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/resume.pdf");
    await expect(link).toHaveAttribute("download", "신호정_웹_이력서.pdf");

    const response = await page.request.get("/resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/pdf");

    // noindex lives in the X-Robots-Tag header, so the PDF must stay crawlable.
    const robots = await page.request.get("/robots.txt");
    expect(await robots.text()).not.toContain("Disallow: /resume.pdf");
  });

  test("header, home, and about fit a phone viewport without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const path of ["/", "/about/", "/projects/"]) {
      await page.goto(path);
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth, path).toBeLessThanOrEqual(clientWidth + 1);
    }
    await expect(page.getByRole("link", { name: "쇼케이스" })).toBeVisible();
  });

  test("unknown route renders the 404 page", async ({ page }) => {
    const response = await page.goto("/no-such-page/");
    expect(response?.status()).toBe(404);
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

    // The footer note must stay a readable line next to the Turnstile widget,
    // not collapse to one character per line (regression seen on a 360px phone).
    const note = page.getByText("AI가 생성한 답변으로");
    const box = await note.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(200);
    expect(box?.height ?? 999).toBeLessThan(40);
    await expect(page.getByRole("link", { name: "이 챗봇은 어떻게 만들어졌나" })).toBeVisible();
  });
});
