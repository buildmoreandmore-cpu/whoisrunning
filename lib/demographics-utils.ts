import {
  DemographicProfile,
  PolicyImpact,
  PolicyCategory,
  POLICY_CATEGORIES,
} from "@/types/demographics";

export function buildAnalysisPrompt(demographics: DemographicProfile): string {
  const { ageRange, incomeRange, raceEthnicity, educationLevel, location } = demographics;

  const locationStr = [location.city, location.county, location.state]
    .filter(Boolean)
    .join(", ");

  const incomeDisplay = formatIncomeRange(incomeRange);

  return `Analyze how local and state policies in ${locationStr} specifically impact people with these demographics:
- Age: ${ageRange} years old
- Income: ${incomeDisplay}
- Race/Ethnicity: ${raceEthnicity}
- Education: ${educationLevel}

Focus on these policy areas and explain how current policies affect this demographic group:

1. **Tax Policies**: State income tax, property tax, sales tax - how do rates and exemptions affect someone in this income bracket and location?

2. **Education**: School funding, public education quality, college affordability programs, scholarships - how does this impact families or individuals at this age and education level?

3. **Healthcare**: Healthcare access, Medicaid eligibility, insurance costs, health programs - what's available for someone at this income level and age?

4. **Housing**: Rent control, property taxes, housing assistance programs, zoning laws - how affordable is housing for this income bracket in this area?

5. **Employment**: Minimum wage laws, worker protections, job training programs, unemployment benefits - what protections and opportunities exist?

6. **Transportation**: Public transit access, infrastructure quality, commute costs - what options and costs exist for someone at this income level?

7. **Social Services**: Food assistance, childcare support, senior programs, disability services - what programs are available based on age, income, and location?

For each policy area:
- Name the specific policy or program
- Explain how it directly affects someone with these exact demographics
- Include dollar amounts, percentages, or concrete impacts when possible
- Mention any recent changes (2023-2025)
- Be specific to ${locationStr}

Focus on factual, objective impacts without political bias. Cite sources where possible.`;
}

export function formatIncomeRange(range: string): string {
  const mapping: Record<string, string> = {
    '<25k': 'Less than $25,000',
    '25-50k': '$25,000 - $50,000',
    '50-75k': '$50,000 - $75,000',
    '75-100k': '$75,000 - $100,000',
    '100-150k': '$100,000 - $150,000',
    '150k+': '$150,000 or more',
  };
  return mapping[range] || range;
}

export function parseImpactsFromResponse(content: string): PolicyImpact[] {
  const impacts: PolicyImpact[] = [];

  // Split content by category headers (looking for numbered sections or bold headers)
  const sections = content.split(/(?:\d+\.\s*\*\*)|(?:^|\n)(?=\*\*[A-Z])/);

  for (const section of sections) {
    if (!section.trim()) continue;

    // Try to extract category name
    const categoryMatch = section.match(/\*\*([^*]+)\*\*/);
    if (!categoryMatch) continue;

    const categoryName = categoryMatch[1].trim().replace(/\d+\.\s*/, '');
    const category = matchCategory(categoryName);

    if (!category) continue;

    // Extract the content after the category name
    const contentAfterHeader = section.substring(categoryMatch.index! + categoryMatch[0].length);

    // Split into bullet points or paragraphs
    const points = contentAfterHeader
      .split(/\n[-•*]\s+|\n\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 20);

    // Take first few significant points
    for (const point of points.slice(0, 3)) {
      if (point.length < 30) continue;

      // Extract title from first sentence or clause
      const titleMatch = point.match(/^([^:.]+[:.])/) || point.match(/^([^.]+)/);
      const title = titleMatch ? titleMatch[1].trim() : categoryName;

      impacts.push({
        category,
        title: title.length > 100 ? title.substring(0, 100) + '...' : title,
        description: point,
      });
    }
  }

  return impacts;
}

function matchCategory(text: string): PolicyCategory | null {
  const normalized = text.toLowerCase();

  for (const category of POLICY_CATEGORIES) {
    const categoryLower = category.toLowerCase();
    if (
      normalized.includes(categoryLower) ||
      categoryLower.includes(normalized)
    ) {
      return category;
    }
  }

  // Fallback matching
  if (normalized.includes('tax')) return 'Tax Policies';
  if (normalized.includes('education') || normalized.includes('school')) return 'Education';
  if (normalized.includes('health') || normalized.includes('medical')) return 'Healthcare';
  if (normalized.includes('housing') || normalized.includes('rent')) return 'Housing';
  if (normalized.includes('employment') || normalized.includes('job') || normalized.includes('wage')) return 'Employment';
  if (normalized.includes('transport')) return 'Transportation';
  if (normalized.includes('social') || normalized.includes('assistance') || normalized.includes('benefit')) return 'Social Services';

  return null;
}

export function generateSummary(
  demographics: DemographicProfile,
  impacts: PolicyImpact[]
): string {
  const locationStr = [demographics.location.city, demographics.location.county, demographics.location.state]
    .filter(Boolean)
    .join(", ");

  const categories = [...new Set(impacts.map((i) => i.category))];

  return `Based on your demographic profile (${demographics.ageRange}, ${formatIncomeRange(
    demographics.incomeRange
  )}) in ${locationStr}, we found ${
    impacts.length
  } relevant policy impacts across ${categories.length} categories: ${categories.join(
    ", "
  )}. These policies directly affect your daily life, from taxes and healthcare to education and employment.`;
}

export function groupImpactsByCategory(impacts: PolicyImpact[]): Record<PolicyCategory, PolicyImpact[]> {
  const grouped: Partial<Record<PolicyCategory, PolicyImpact[]>> = {};

  for (const impact of impacts) {
    if (!grouped[impact.category]) {
      grouped[impact.category] = [];
    }
    grouped[impact.category]!.push(impact);
  }

  return grouped as Record<PolicyCategory, PolicyImpact[]>;
}
