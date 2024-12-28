export interface CatchInfo {
    CatchDate?: string;
    CatchTime?: string;
    Fishermen?: string;
    Species?: string;
    BodyOfWater?: string;
    Location?: number[];
    Lure?: string;
    Weight?: string;
    Length?: number;
    Tag?: string;
    WaterTemp?: number;
    AirTemp?: number;
    WindSpeed?: number;
    WindDirection?: string;
    Pressure?: number;
    Sunrise?: string;
    Sunset?: string;
    MoonPhase?: string;
    TideDirection?: string;
    HighTideOffset?: number;
    LowTideOffset?: number;
    TideInfo?: [{
      TideHeight?: number;
      TideTime?: string;
      TideType?: string;
  }];
    Picture?: string;
}