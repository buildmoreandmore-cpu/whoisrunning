# WhoIsRunning.org - Political Transparency Platform

A Next.js web application that provides transparent, unbiased information about political candidates using AI-powered research through the Perplexity API.

**Live Site:** https://whoisrunning.org

**Vercel Project:** https://vercel.com/francis-projects-cc692baf/whoisrunning-org

## Overview

WhoIsRunning.org helps voters research political candidates by providing comprehensive information including voting records, policy positions, quotes, and recent news. The platform uses AI to aggregate and present factual, balanced political information.

## How It Works

### Core Architecture

The application is built with Next.js 15 and uses a serverless architecture deployed on Vercel. It leverages the Perplexity AI API for real-time political research and information gathering.

### Key Features

#### 1. Location-Based Politician Search
- **State/City/County Filters:** Users can narrow down candidates by geographic location
- **Dynamic Data Loading:** Cities and counties are fetched based on selected state
- **API Endpoints:**
  - `/api/location/cities` - Returns cities for a given state
  - `/api/location/counties` - Returns counties for a given state
  - `/api/location/politicians` - Returns politicians matching location filters

**Implementation:** `components/features/location-filter/LocationFilter.tsx:29-218`

#### 2. Candidate Search
- **Name-Based Search:** Direct search for specific politicians
- **Search Bar Component:** `components/features/candidate/SearchBar.tsx`
- Users can type candidate names to find detailed profiles

#### 3. Trending Candidates Dashboard
- Displays the most talked-about political figures based on recent news
- Shows search volume metrics and trending percentages
- Updates dynamically with fresh data from Perplexity API
- Falls back to mock data if API returns insufficient results

**Implementation:** `lib/candidate-service.ts:78-100`

#### 4. Recent Election Winners
- Tracks recent election results (last 3 months)
- Displays winner information including vote percentages
- Shows party affiliation and election dates

**Implementation:** `lib/candidate-service.ts:102-124`

#### 5. Detailed Candidate Profiles
- **Comprehensive Information:**
  - Political party and office
  - Biography (2-3 sentences)
  - Ideology tags (Healthcare, Environment, Economy, etc.)
  - Key policy positions (up to 5 stances)
  - Notable quotes with sources and dates
  - Resources (videos, articles, interviews)
  - Social media links (Twitter, Facebook, Website)

- **Dynamic Route:** `/candidate/[id]`
- **Client Component:** `app/candidate/[id]/CandidateDetailClient.tsx:1-277`

**Data Fetching:** The system makes 3 parallel API calls to gather:
1. Profile information (party, office, background, voting record)
2. Ideological positions and quotes
3. Media resources (videos, articles)

**Implementation:** `lib/candidate-service.ts:44-76`

### AI-Powered Research System

#### Perplexity API Integration

The platform uses Perplexity's "sonar" model for real-time web research.

**API Route:** `app/api/perplexity/research/route.ts:1-93`

**Configuration:**
- **Model:** `sonar` (Perplexity's latest search model)
- **Temperature:** 0.2 (for factual, consistent responses)
- **Max Tokens:** 2000
- **Return Citations:** Enabled
- **Search Recency Filter:** Last month

**System Prompt:**
```
You are a political research assistant that provides factual, unbiased
information about political candidates. Always cite sources and provide
balanced perspectives. Focus on:
- Political positions and ideology
- Voting record (if applicable)
- Public statements and quotes
- Campaign promises and platform
- Background and experience
- Recent news and developments
```

#### Data Parsing & Extraction

The application includes sophisticated parsing logic to convert AI responses into structured data:

1. **Candidate List Parsing:** `lib/candidate-service.ts:127-183`
   - Detects candidate names from numbered/bulleted lists
   - Extracts party affiliation (Democrat, Republican, Independent)
   - Identifies office/position
   - Generates unique candidate IDs

2. **Detailed Profile Parsing:** `lib/candidate-service.ts:206-266`
   - Extracts party from context
   - Identifies current office or race
   - Generates concise bio from first 2-3 sentences
   - Tags ideology based on keyword matching
   - Extracts quotes, resources, and policy positions

3. **Quote Extraction:** `lib/candidate-service.ts:268-285`
   - Finds quoted text in responses
   - Associates with sources and dates
   - Limits to 3 most relevant quotes

4. **Resource Extraction:** `lib/candidate-service.ts:287-317`
   - Identifies YouTube video links
   - Extracts news article URLs
   - Categorizes as video or article type

5. **Key Positions Extraction:** `lib/candidate-service.ts:319-341`
   - Finds policy-related statements
   - Filters for sentences with key verbs (support, advocate, propose, oppose)
   - Returns up to 5 key positions

### Frontend Architecture

#### Component Structure

**Layout Components:**
- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx:1-80` - Main homepage with hero, filters, trending sections

**UI Components (Shadcn/UI):**
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card container
- `components/ui/select.tsx` - Dropdown select
- `components/ui/badge.tsx` - Badge for tags/labels
- `components/ui/input.tsx` - Input field

**Feature Components:**
- `components/features/analytics/TrendingCandidatesServer.tsx` - Server component for trending
- `components/features/analytics/RecentWinnersServer.tsx` - Server component for winners
- `components/features/location-filter/LocationFilter.tsx` - Location filter UI
- `components/features/location-filter/PoliticianResults.tsx` - Search results display
- `components/features/candidate/SearchBar.tsx` - Search input
- `components/features/candidate/CandidateCard.tsx` - Candidate preview card

#### State Management

**Location Context:** `context/LocationContext.tsx`
- Manages selected state, county, and city
- Provides global filter state across components
- Enables filter reset functionality

#### Styling

- **Framework:** Tailwind CSS 4.1.16
- **Design System:** Gradient backgrounds (blue to purple)
- **Theme:** Light mode with accent colors for party affiliation
  - Democrat: Blue
  - Republican: Red
  - Independent: Purple
  - Other: Gray

### Data Flow

1. **User Interaction** → User selects location filters or searches for candidate
2. **State Update** → React context updates with filter selections
3. **API Request** → Frontend calls `/api/location/politicians` or `/api/perplexity/research`
4. **Perplexity API** → Backend queries Perplexity with structured prompts
5. **Response Parsing** → AI response is parsed into structured `Candidate` objects
6. **UI Rendering** → Components display formatted candidate information

### Error Handling & Fallbacks

- API errors return mock data to maintain user experience
- Loading states with spinner animations
- "Candidate Not Found" pages with navigation back to home
- Insufficient AI data triggers fallback to mock trending/winners data

## Technical Stack

- **Framework:** Next.js 15.0.1
- **React:** 19.2.0
- **TypeScript:** 5.9.3
- **Styling:** Tailwind CSS 4.1.16
- **UI Components:** Radix UI + Shadcn/UI
- **AI API:** Perplexity AI (Sonar model)
- **Deployment:** Vercel
- **Node Version:** 22.x

## Environment Variables

Required environment variables (configured in Vercel):

```
PERPLEXITY_API_KEY=your_perplexity_api_key
```

## Project Structure

```
whoisrunning-org/
├── app/
│   ├── api/
│   │   ├── perplexity/research/route.ts    # AI research endpoint
│   │   ├── location/
│   │   │   ├── cities/route.ts             # Cities API
│   │   │   ├── counties/route.ts           # Counties API
│   │   │   └── politicians/route.ts        # Politicians search API
│   ├── candidate/[id]/
│   │   ├── page.tsx                        # Dynamic candidate page
│   │   └── CandidateDetailClient.tsx       # Client-side candidate detail
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Homepage
├── components/
│   ├── ui/                                 # Shadcn UI components
│   └── features/                           # Feature-specific components
│       ├── analytics/                      # Trending & winners
│       ├── candidate/                      # Candidate cards & search
│       └── location-filter/                # Location filters
├── context/
│   └── LocationContext.tsx                 # Location state management
├── lib/
│   ├── candidate-service.ts                # Candidate data fetching & parsing
│   └── perplexity-client.ts                # Perplexity API client
├── types/
│   ├── candidate.ts                        # Candidate type definitions
│   └── location.ts                         # Location type definitions
├── constants/                              # Static data (states, etc.)
└── hooks/                                  # Custom React hooks
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test
```

## Deployment

The application is deployed on Vercel with automatic deployments from the main branch.

**Production URL:** https://whoisrunning.org

**Vercel Configuration:** `vercel.json`

### Deployment Process

1. Push changes to Git repository
2. Vercel automatically detects changes
3. Builds Next.js application
4. Deploys to production
5. Updates DNS records for custom domain

## API Limitations & Considerations

- **Perplexity API Rate Limits:** Monitor usage to avoid rate limiting
- **Real-time Data:** Information is as current as Perplexity's web index
- **Parsing Accuracy:** AI responses may vary in format, parsing logic handles common patterns
- **Mock Data Fallback:** Ensures user experience even if API fails

## Future Enhancements

- User accounts and saved candidates
- Email alerts for candidate news
- Voting record integration (Congress API)
- Campaign finance data
- Comparison tool (side-by-side candidates)
- Mobile app version
- Multi-language support

## License

ISC

## Contact

For issues or questions about the platform, please contact the development team.

---

**Built with Claude Code** - Political transparency through AI-powered research
