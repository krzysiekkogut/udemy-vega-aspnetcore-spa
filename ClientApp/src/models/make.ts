import { Model } from "./model";

export interface SimpleMake {
  id: number;
  name: string;
}

export interface Make extends SimpleMake {
  models: Model[];
}