
import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

// Search Google for a keyword and extract ranking results
export async function rankTracker(keyword, targetDomain) {
  let browser;

  try {
    // 1. Create Browserbase session
    const session = await bb.sessions.create({
      browserSettings: {
        blockAds: true,
      },
    });

    // 2. Connect Playwright
    browser = await chromium.connectOverCDP(session.connectUrl);

    const page = browser.contexts()[0].pages()[0];

    page.setDefaultNavigationTimeout(45000);

    // 3. Open Google
    await page.goto("https://www.google.com", {
      waitUntil: "networkidle",
    });

    // 4. Handle Google consent popup
    try {
      const btn = await page.$(
        'button[id="L2AGLB"], form[action*="consent"] button'
      );

      if (btn) {
        await btn.click();
        await page.waitForTimeout(1500);
      }
    } catch {}

    let found = null;
    let allResults = [];

    const cleanTarget = targetDomain
      .replace("www.", "")
      .toLowerCase();

    // 5. Loop through Google result pages
    for (let gpage = 0; gpage < 5; gpage++) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
        keyword
      )}&start=${gpage * 10}&num=10&hl=en&gl=us`;

      await page.goto(searchUrl, {
        waitUntil: "networkidle",
      });

      let pageResults = [];

      // Retry extraction up to 3 times
      for (let retry = 0; retry < 3; retry++) {
        try {
          await page.waitForSelector("h3", {
            timeout: 8000,
          });

          await page.waitForTimeout(1500);

          pageResults = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("h3"))
              .map((h3) => {
                let a = h3.closest("a");

                // Try finding parent anchor
                if (!a) {
                  let p = h3.parentElement;

                  for (let j = 0; j < 5 && p; j++, p = p.parentElement) {
                    if (p.tagName === "A") {
                      a = p;
                      break;
                    }

                    const sub = p.querySelector("a[href]");

                    if (sub && sub.contains(h3)) {
                      a = sub;
                      break;
                    }
                  }
                }

                // Skip invalid links
                if (
                  !a ||
                  !a.href.startsWith("http") ||
                  a.href.includes("google.")
                ) {
                  return null;
                }

                // Extract snippet
                let snippet = "";
                let c = a.parentElement;

                for (let j = 0; j < 6 && c; j++, c = c.parentElement) {
                  const txt = c.innerText || "";

                  if (txt.length > h3.innerText.length + 50) {
                    snippet = (
                      txt
                        .split("\n")
                        .find(
                          (l) =>
                            l.length > 30 &&
                            !l.includes(
                              h3.innerText.substring(0, 20)
                            )
                        ) || ""
                    )
                      .trim()
                      .substring(0, 300);
                  }

                  if (snippet) break;
                }

                return {
                  url: a.href,
                  domain: new URL(a.href).hostname.replace(
                    "www.",
                    ""
                  ),
                  title: h3.innerText.trim(),
                  snippet,
                };
              })
              .filter(Boolean);
          });

          if (pageResults.length > 0) break;

          await page.reload({
            waitUntil: "networkidle",
          });
        } catch (err) {
          if (retry === 2) break;

          await page.reload({
            waitUntil: "networkidle",
          });
        }
      }

      // Stop if no results
      if (!pageResults.length) break;

      // Save all results
      allResults.push(...pageResults);

      // Find target domain rank
      for (let i = 0; i < pageResults.length; i++) {
        const result = pageResults[i];

        if (
          result.domain
            .toLowerCase()
            .includes(cleanTarget)
        ) {
          found = {
            position: gpage * 10 + i + 1,
            ...result,
          };

          break;
        }
      }

      // Stop if found
      if (found) break;
    }

    return {
      keyword,
      targetDomain,
      found,
      totalResults: allResults.length,
      results: allResults,
    };
  } catch (error) {
    console.error("Rank Tracker Error:", error);

    return {
      error: error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

