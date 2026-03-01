export interface Channel {
  name: string;
  logo: string;
  category: string;
  type: string;
  url: string;
  clearKey?: Record<string, string>;
  subscribers: string;
  views: string;
  id?: string; // DB channels have an id
}
