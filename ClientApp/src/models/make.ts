import { Model } from "./model";

export interface Make {
  id: number;
  name: string;
  models: Model[];
}