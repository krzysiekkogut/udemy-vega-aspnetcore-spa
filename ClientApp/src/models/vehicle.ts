export interface Vehicle {
  makeId?: number;
  modelId?: number;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  isRegistered: boolean;
  features: number[]
}

export function getEmptyVehicle(): Vehicle {
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