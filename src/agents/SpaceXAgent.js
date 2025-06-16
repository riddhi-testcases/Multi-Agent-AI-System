export class SpaceXAgent {
  constructor() {
    this.name = 'SpaceX';
    this.baseUrl = 'https://api.spacexdata.com/v4';
  }

  async execute(action, dependencies = {}) {
    switch (action) {
      case 'getNextLaunch':
        return await this.getNextLaunch();
      case 'getRecentLaunches':
        return await this.getRecentLaunches();
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  async getNextLaunch() {
    try {
      // Get upcoming launches sorted by date
      const response = await fetch(`${this.baseUrl}/launches/upcoming?sort=date_utc&order=asc`);
      if (!response.ok) {
        throw new Error(`SpaceX API error: ${response.status} - ${response.statusText}`);
      }

      const launches = await response.json();
      if (launches.length === 0) {
        // If no upcoming launches, get the most recent launch
        return await this.getLatestLaunch();
      }

      const nextLaunch = launches[0];
      
      // Get detailed information about the launch
      const enrichedLaunch = await this.enrichLaunchData(nextLaunch);
      
      return enrichedLaunch;
    } catch (error) {
      throw new Error(`Failed to get SpaceX launch data: ${error.message}`);
    }
  }

  async getLatestLaunch() {
    try {
      const response = await fetch(`${this.baseUrl}/launches/latest`);
      if (!response.ok) {
        throw new Error(`SpaceX API error: ${response.status}`);
      }

      const launch = await response.json();
      return await this.enrichLaunchData(launch);
    } catch (error) {
      throw new Error(`Failed to get latest SpaceX launch: ${error.message}`);
    }
  }

  async getRecentLaunches() {
    try {
      const response = await fetch(`${this.baseUrl}/launches/past?sort=date_utc&order=desc&limit=5`);
      if (!response.ok) {
        throw new Error(`SpaceX API error: ${response.status}`);
      }

      const launches = await response.json();
      return Promise.all(launches.map(launch => this.enrichLaunchData(launch)));
    } catch (error) {
      throw new Error(`Failed to get recent SpaceX launches: ${error.message}`);
    }
  }

  async enrichLaunchData(launch) {
    let location = 'Unknown';
    let launchpadDetails = null;
    let rocketDetails = null;
    let payloadDetails = [];

    // Get launchpad details
    if (launch.launchpad) {
      try {
        const launchpadResponse = await fetch(`${this.baseUrl}/launchpads/${launch.launchpad}`);
        if (launchpadResponse.ok) {
          launchpadDetails = await launchpadResponse.json();
          location = `${launchpadDetails.full_name}, ${launchpadDetails.locality}, ${launchpadDetails.region}`;
        }
      } catch (e) {
        console.warn('Could not fetch launchpad details:', e.message);
      }
    }

    // Get rocket details
    if (launch.rocket) {
      try {
        const rocketResponse = await fetch(`${this.baseUrl}/rockets/${launch.rocket}`);
        if (rocketResponse.ok) {
          rocketDetails = await rocketResponse.json();
        }
      } catch (e) {
        console.warn('Could not fetch rocket details:', e.message);
      }
    }

    // Get payload details
    if (launch.payloads && launch.payloads.length > 0) {
      try {
        const payloadPromises = launch.payloads.map(payloadId =>
          fetch(`${this.baseUrl}/payloads/${payloadId}`).then(res => res.ok ? res.json() : null)
        );
        const payloads = await Promise.all(payloadPromises);
        payloadDetails = payloads.filter(payload => payload !== null);
      } catch (e) {
        console.warn('Could not fetch payload details:', e.message);
      }
    }

    // Calculate time until launch (for upcoming launches)
    const launchDate = new Date(launch.date_utc);
    const now = new Date();
    const timeUntilLaunch = launchDate > now ? launchDate - now : null;

    return {
      id: launch.id,
      name: launch.name,
      date_utc: launch.date_utc,
      date_local: launch.date_local,
      location,
      details: launch.details,
      webcast: launch.links?.webcast,
      patch: launch.links?.patch?.large,
      success: launch.success,
      upcoming: launch.upcoming,
      launchpad: launch.launchpad,
      
      // Enriched data
      launchpadDetails: launchpadDetails ? {
        name: launchpadDetails.full_name,
        status: launchpadDetails.status,
        locality: launchpadDetails.locality,
        region: launchpadDetails.region,
        timezone: launchpadDetails.timezone,
        latitude: launchpadDetails.latitude,
        longitude: launchpadDetails.longitude,
        details: launchpadDetails.details
      } : null,
      
      rocketDetails: rocketDetails ? {
        name: rocketDetails.name,
        type: rocketDetails.type,
        active: rocketDetails.active,
        stages: rocketDetails.stages,
        boosters: rocketDetails.boosters,
        cost_per_launch: rocketDetails.cost_per_launch,
        success_rate_pct: rocketDetails.success_rate_pct,
        first_flight: rocketDetails.first_flight,
        country: rocketDetails.country,
        company: rocketDetails.company,
        height: rocketDetails.height,
        diameter: rocketDetails.diameter,
        mass: rocketDetails.mass
      } : null,
      
      payloadDetails: payloadDetails.map(payload => ({
        name: payload.name,
        type: payload.type,
        mass_kg: payload.mass_kg,
        orbit: payload.orbit,
        customers: payload.customers,
        manufacturers: payload.manufacturers,
        nationality: payload.nationality
      })),
      
      // Time calculations
      timeUntilLaunch: timeUntilLaunch ? this.formatTimeUntilLaunch(timeUntilLaunch) : null,
      launchWindow: this.calculateLaunchWindow(launch),
      
      // Status information
      flightNumber: launch.flight_number,
      missionStatus: this.getMissionStatus(launch),
      
      // Additional links
      links: {
        webcast: launch.links?.webcast,
        wikipedia: launch.links?.wikipedia,
        article: launch.links?.article,
        presskit: launch.links?.presskit,
        patch: launch.links?.patch,
        reddit: launch.links?.reddit
      }
    };
  }

  formatTimeUntilLaunch(milliseconds) {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}, ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  }

  calculateLaunchWindow(launch) {
    const launchDate = new Date(launch.date_utc);
    
    // Most SpaceX launches have instantaneous launch windows or very short windows
    // This is a simplified calculation
    return {
      opens: launchDate.toISOString(),
      duration: 'Instantaneous', // Most SpaceX launches are instantaneous
      timezone: 'UTC'
    };
  }

  getMissionStatus(launch) {
    if (launch.upcoming) {
      const launchDate = new Date(launch.date_utc);
      const now = new Date();
      const hoursUntilLaunch = (launchDate - now) / (1000 * 60 * 60);
      
      if (hoursUntilLaunch < 24) {
        return 'IMMINENT';
      } else if (hoursUntilLaunch < 168) { // 1 week
        return 'UPCOMING_SOON';
      } else {
        return 'SCHEDULED';
      }
    } else if (launch.success === true) {
      return 'SUCCESS';
    } else if (launch.success === false) {
      return 'FAILURE';
    } else {
      return 'COMPLETED';
    }
  }
}