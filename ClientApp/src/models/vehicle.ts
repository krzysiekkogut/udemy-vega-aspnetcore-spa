import { Contact } from './contact';
import { Feature } from './feature';
import { SimpleMake } from './make';
import { Model } from './model';

export interface VehicleForSave {
  id?: number
  makeId?: number;
  modelId?: number;
  contact: Contact;
  isRegistered: boolean;
  features: number[]
}

export interface Vehicle {
  id: number;
  model: Model;
  make: SimpleMake;
  isRegistered: boolean;
  contact: Contact;
  lastUpdate: Date;
  features: Feature[];
}

export function getEmptyVehicle(): VehicleForSave {
  return {
    contact: {
      name: '',
      phone: '',
      email: '',
    },
    isRegistered: false,
    features: []
  }
}