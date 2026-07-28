export interface ParsedPoint {
  id: string;
  num?: string;
  title: string;
  body: string;
}

/**
 * Parses raw AI recommendation string into individual structured point objects.
 * Handles formats like:
 * "1. OverAll : Body text... 2. Pace : Body text... 3. Heart Rate : Body text..."
 * as well as bulleted points or standard paragraphs.
 */
export function parseRecommendationPoints(text: string): ParsedPoint[] {
  if (!text || !text.trim()) return [];

  const raw = text.trim();

  // Pattern 1: Numbered points like "1. OverAll : ... 2. Pace : ..." or "\n1. ..."
  const numberedRegex = /(?:^|\s*)(\d+)[\.\)]\s*([^:\-\n]+)?[:\-]?\s*([\s\S]*?)(?=(?:\s+\d+[\.\)]\s*)|$)/gi;
  const points: ParsedPoint[] = [];

  let match;
  while ((match = numberedRegex.exec(raw)) !== null) {
    const num = match[1];
    let title = match[2] ? match[2].trim() : "";
    let body = match[3] ? match[3].trim() : "";

    // Clean leading colon/dash from body
    body = body.replace(/^[:\-]\s*/, "").trim();

    // If title was not captured before colon, check if body starts with "Title : Content"
    if (!title && body.includes(":")) {
      const parts = body.split(":");
      title = parts[0].trim();
      body = parts.slice(1).join(":").trim();
    }

    if (title || body) {
      points.push({
        id: `point-${num}-${Date.now()}`,
        num,
        title: title || `Key Insight ${num}`,
        body: body,
      });
    }
  }

  // Fallback: If regex didn't split into numbered points, check for bullet lines or return single point
  if (points.length === 0) {
    const lines = raw.split(/\n+/).filter((l) => l.trim().length > 0);
    if (lines.length > 1) {
      lines.forEach((line, idx) => {
        const cleaned = line.replace(/^[•\-\*]\s*/, "").trim();
        if (cleaned.includes(":")) {
          const [t, ...b] = cleaned.split(":");
          points.push({
            id: `line-${idx}`,
            num: String(idx + 1),
            title: t.trim(),
            body: b.join(":").trim(),
          });
        } else {
          points.push({
            id: `line-${idx}`,
            num: String(idx + 1),
            title: `Insight ${idx + 1}`,
            body: cleaned,
          });
        }
      });
    } else {
      points.push({
        id: "single-overview",
        title: "Overall Insight",
        body: raw,
      });
    }
  }

  return points;
}
