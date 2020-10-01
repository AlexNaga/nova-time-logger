export interface ConfigInterface {
  site: string;
  url: string;
  username: string;
  password: string;
  message: string;
  project: string;
  isDebug: boolean;
  showLogs: boolean;
  hours: number;
  days: number;
  week: boolean;
  screen?: { height?: number, width?: number };
}
