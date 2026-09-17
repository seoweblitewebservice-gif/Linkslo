type PublicGigTitleInput = {
  domain?: string | null;
  subcategory?: string | null;
  category?: string | null;
  industry?: string | null;
  country?: string | null;
};

const COMPACT_TOPICS: Record<string, string> = {
  "Custom Monthly Link Building Campaigns": "Monthly Link Building",
  "Premium Link Building Campaigns": "Premium Link Building",
  "Unlinked Brand Mention Link Building": "Unlinked Brand Mention Links",
  "Language-Specific Backlinks": "Language-Specific Backlinks",
  "Country-Specific Backlinks": "Country-Specific Backlinks",
};

function clean(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function compactTopic(value: string) {
  return COMPACT_TOPICS[value] ?? value
    .replace(/^Custom\s+/i, "")
    .replace(/\s+Campaigns$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function includesPhrase(source: string, phrase: string) {
  return source.toLowerCase().includes(phrase.toLowerCase());
}

function fitTitle(value: string, max = 72) {
  if (value.length <= max) return value;
  const words = value.split(" ");
  let result = "";
  for (const word of words) {
    const next = result ? `${result} ${word}` : word;
    if (next.length > max) break;
    result = next;
  }
  return result || value.slice(0, max).trim();
}

/**
 * Public-facing marketplace title. Keep search/filter dimensions in badges and
 * metadata instead of stuffing service + industry + country + page type into H1.
 */
export function publicGigTitle(input: PublicGigTitleInput) {
  const domain = clean(input.domain);
  if (domain) return `Guest Post on ${domain}`;

  const topic = compactTopic(clean(input.subcategory) || clean(input.category) || "Link Building Service");
  const industry = clean(input.industry);
  const country = clean(input.country);
  const category = clean(input.category);
  const topicLower = topic.toLowerCase();

  const preferCountry =
    category === "Country-Specific Backlinks" ||
    topicLower.includes("local") ||
    topicLower.includes("citation");
  const preferIndustry = category === "Industry-Specific Backlinks";

  const candidates: string[] = [];

  if (preferCountry && country && country !== "International" && !includesPhrase(topic, country)) {
    candidates.push(`${topic} for ${country}`);
  }

  if (preferIndustry && industry && industry !== "General" && !includesPhrase(topic, industry)) {
    candidates.push(`${topic} for ${industry}`);
  }

  if (!preferCountry && !preferIndustry && industry && industry !== "General" && !includesPhrase(topic, industry)) {
    candidates.push(`${topic} for ${industry}`);
  }

  if (!preferIndustry && country && country !== "International" && !includesPhrase(topic, country)) {
    candidates.push(`${topic} for ${country}`);
  }

  candidates.push(topic);

  const cleanCandidate = candidates.find((candidate) => candidate.length <= 72) ?? topic;
  return fitTitle(cleanCandidate);
}

export function publicGigMetaTitle(input: PublicGigTitleInput) {
  const title = publicGigTitle(input);
  const branded = `${title} | Linkslo`;
  return branded.length <= 65 ? branded : fitTitle(title, 62);
}
