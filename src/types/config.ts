export interface Config {
  site: string;
  url: string;
  username: string;
  password: string;
  project: string;
  screen?: { height?: number, width?: number };
}
