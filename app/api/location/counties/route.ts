import { NextRequest, NextResponse } from "next/server";

// US Census Bureau API - free, no API key required
// Documentation: https://www.census.gov/data/developers/data-sets/popest-popproj/popest.html

const CENSUS_API_BASE = "https://api.census.gov/data/2021/pep/population";

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

    // Fetch counties from Census API
    const url = `${CENSUS_API_BASE}?get=NAME&for=county:*&in=state:${stateFips}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Census API error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to fetch counties from Census API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Census API returns [["NAME", "state", "county"], ["County Name", "13", "001"], ...]
    // Skip the header row and extract county names
    const counties = data
      .slice(1)
      .map((row: string[]) => {
        const countyName = row[0].replace(" County", "").replace(", " + stateCode, "");
        return {
          name: countyName,
          fips: row[2],
          fullName: row[0]
        };
      })
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json({
      state: stateCode,
      counties: counties,
      count: counties.length
    });

  } catch (error: any) {
    console.error("Error fetching counties:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
