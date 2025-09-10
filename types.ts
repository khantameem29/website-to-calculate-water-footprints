
export interface WaterFootprintBreakdown {
  stage: string;
  liters: number;
}

export interface WaterFootprintData {
  itemName: string;
  waterFootprintLiters: number;
  comparison: string;
  breakdown: WaterFootprintBreakdown[];
}
