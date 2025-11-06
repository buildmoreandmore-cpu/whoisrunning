export interface DemographicProfile {
  ageRange: AgeRange;
  incomeRange: IncomeRange;
  raceEthnicity: RaceEthnicity;
  educationLevel: EducationLevel;
  location: {
    state: string;
    county?: string;
    city?: string;
  };
}

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';

export type IncomeRange = '<25k' | '25-50k' | '50-75k' | '75-100k' | '100-150k' | '150k+';

export type RaceEthnicity =
  | 'White'
  | 'Black or African American'
  | 'Hispanic or Latino'
  | 'Asian'
  | 'Native American or Alaska Native'
  | 'Native Hawaiian or Pacific Islander'
  | 'Two or More Races'
  | 'Other'
  | 'Prefer not to say';

export type EducationLevel =
  | 'High School or Less'
  | 'Some College'
  | 'Bachelor\'s Degree'
  | 'Graduate Degree';

export interface PolicyImpact {
  category: PolicyCategory;
  title: string;
  description: string;
  source?: string;
  relevanceScore?: number;
}

export type PolicyCategory =
  | 'Tax Policies'
  | 'Education'
  | 'Healthcare'
  | 'Housing'
  | 'Employment'
  | 'Transportation'
  | 'Social Services';

export interface Citation {
  url: string;
  title?: string;
  source?: string;
}

export interface ImpactAnalysisResult {
  demographics: DemographicProfile;
  impacts: PolicyImpact[];
  summary: string;
  citations: Citation[];
  timestamp: string;
}

// Dropdown options for form
export const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18-24 years old' },
  { value: '25-34', label: '25-34 years old' },
  { value: '35-44', label: '35-44 years old' },
  { value: '45-54', label: '45-54 years old' },
  { value: '55-64', label: '55-64 years old' },
  { value: '65+', label: '65+ years old' },
];

export const INCOME_RANGES: { value: IncomeRange; label: string }[] = [
  { value: '<25k', label: 'Less than $25,000' },
  { value: '25-50k', label: '$25,000 - $50,000' },
  { value: '50-75k', label: '$50,000 - $75,000' },
  { value: '75-100k', label: '$75,000 - $100,000' },
  { value: '100-150k', label: '$100,000 - $150,000' },
  { value: '150k+', label: '$150,000+' },
];

export const RACE_ETHNICITY_OPTIONS: { value: RaceEthnicity; label: string }[] = [
  { value: 'White', label: 'White' },
  { value: 'Black or African American', label: 'Black or African American' },
  { value: 'Hispanic or Latino', label: 'Hispanic or Latino' },
  { value: 'Asian', label: 'Asian' },
  { value: 'Native American or Alaska Native', label: 'Native American or Alaska Native' },
  { value: 'Native Hawaiian or Pacific Islander', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'Two or More Races', label: 'Two or More Races' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export const EDUCATION_LEVELS: { value: EducationLevel; label: string }[] = [
  { value: 'High School or Less', label: 'High School or Less' },
  { value: 'Some College', label: 'Some College / Associate Degree' },
  { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
  { value: 'Graduate Degree', label: 'Graduate Degree (Master\'s, PhD, etc.)' },
];

export const POLICY_CATEGORIES: PolicyCategory[] = [
  'Tax Policies',
  'Education',
  'Healthcare',
  'Housing',
  'Employment',
  'Transportation',
  'Social Services',
];
