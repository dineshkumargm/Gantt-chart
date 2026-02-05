
export interface Task {
  id: string;
  activity: string;
  planStart: number;
  planDuration: number;
  actualStart: number;
  actualDuration: number;
  percentComplete: number;
}

export enum BarType {
  PLAN_DURATION = 'PLAN_DURATION',
  ACTUAL_START = 'ACTUAL_START',
  PERCENT_COMPLETE = 'PERCENT_COMPLETE',
  ACTUAL_BEYOND = 'ACTUAL_BEYOND',
  PERCENT_BEYOND = 'PERCENT_BEYOND'
}
