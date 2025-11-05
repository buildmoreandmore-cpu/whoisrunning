import { NextRequest, NextResponse } from "next/server";

// Use Census ACS (American Community Survey) for place data
// Documentation: https://www.census.gov/data/developers/data-sets/acs-5year.html

const CENSUS_API_BASE = "https://api.census.gov/data/2021/acs/acs5";

// State FIPS codes mapping
const STATE_FIPS: { [key: string]: string } = {
  AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09", DE: "10",
  FL: "12", GA: "13", HI: "15", ID: "16", IL: "17", IN: "18", IA: "19", KS: "20",
  KY: "21", LA: "22", ME: "23", MD: "24", MA: "25", MI: "26", MN: "27", MS: "28",
  MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36",
  NC: "37", ND: "38", OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45",
  SD: "46", TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
  WI: "55", WY: "56", DC: "11"
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stateCode = searchParams.get("state");
    const countyFips = searchParams.get("county");

    if (!stateCode) {
      return NextResponse.json(
        { error: "State parameter is required" },
        { status: 400 }
      );
    }

    const stateFips = STATE_FIPS[stateCode.toUpperCase()];
    if (!stateFips) {
      return NextResponse.json(
        { error: "Invalid state code" },
        { status: 400 }
      );
    }

    // Fetch places (cities) from Census ACS API
    const url = `${CENSUS_API_BASE}?get=NAME,B01003_001E&for=place:*&in=state:${stateFips}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Census API error:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Census API error body:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch cities from Census API", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Census API returns [["NAME", "B01003_001E", "state", "place"], ["City Name", "12345", "13", "00001"], ...]
    // B01003_001E is total population
    // Skip the header row and extract city names
    const cities = data
      .slice(1)
      .map((row: string[]) => {
        const cityName = row[0]
          .replace(" city", "")
          .replace(" town", "")
          .replace(" village", "")
          .replace(" CDP", "")
          .replace(", " + stateCode, "");
        const pop = parseInt(row[1]) || 0;
        return {
          name: cityName,
          population: pop,
          fips: row[3],
          fullName: row[0]
        };
      })
      // Filter to cities with population > 5000 for relevance
      .filter((city: any) => city.population > 5000)
      // Sort by population descending
      .sort((a: any, b: any) => b.population - a.population)
      // Limit to top 100 cities per state
      .slice(0, 100);

    return NextResponse.json({
      state: stateCode,
      county: countyFips || null,
      cities: cities,
      count: cities.length,
      note: countyFips ? "County filtering not fully supported by Census API. Showing all major cities in state." : null
    });

  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
