import * as React from 'react';
import { toast } from 'react-toastify';
import { Make } from '../models/make';
import { Feature } from '../models/feature';
import { Vehicle, getEmptyVehicle } from '../models/vehicle';

interface FormTouchedValidation {
  makeId: boolean;
  modelId: boolean;
  contact: {
    name: boolean;
    phone: boolean;
    email: boolean;
  };
  isRegistered: boolean;
  features: boolean;
}

interface VehicleFormState {
  makes: Make[];
  features: Feature[];
  vehicle: Vehicle;
  formTouched: FormTouchedValidation;
}

class VehicleForm extends React.PureComponent<{}, VehicleFormState> {
  state: VehicleFormState = {
    makes: [],
    features: [],
    vehicle: getEmptyVehicle(),
    formTouched: {
      makeId: false,
      modelId: false,
      contact: {
        name: false,
        phone: false,
        email: false
      },
      isRegistered: false,
      features: false
    }
  }

  constructor(props: {}) {
    super(props);

    this.onMakeChanged = this.onMakeChanged.bind(this);
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onIsRegisteredChanged = this.onIsRegisteredChanged.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onVehicleSubmit = this.onVehicleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.fetchMakes();
    await this.fetchFeatures();
  }

  public render() {
    return (
      <React.Fragment>
        <h1>New Vehicle</h1>
        <form onSubmit={this.onVehicleSubmit}>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select id="make" className="form-control" onChange={this.onMakeChanged} value={this.state.vehicle.makeId}>
              <option value=""></option>
              {
                this.state.makes.map((make: Make) => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))
              }
            </select>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.makeId || !!this.state.vehicle.makeId}>Please specify the make.</div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select id="model" className="form-control" onChange={this.onModelChanged} value={this.state.vehicle.modelId}>
              <option value=""></option>
              {
                this.state.vehicle.makeId &&
                this.state.makes
                  .find(make => make.id === this.state.vehicle.makeId)!.models
                  .map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))
              }
            </select>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.modelId || !!this.state.vehicle.modelId}>Please specify the model.</div>

          <p>Is this vehicle registered?</p>
          <div className="form-group form-check">
            <input className="form-check-input" type="radio" id="registered_yes" checked={this.state.vehicle.isRegistered} onChange={this.onIsRegisteredChanged} />
            <label className="form-check-label" htmlFor="registered_yes">Yes</label>
          </div>
          <div className="form-group form-check">
            <input className="form-check-input" type="radio" id="registered_no" checked={!this.state.vehicle.isRegistered} onChange={this.onIsRegisteredChanged} />
            <label className="form-check-label" htmlFor="registered_no">No</label>
          </div>

          <h2>Features</h2>
          {
            this.state.features.map(feature => (
              <div key={feature.id} className="form-group form-check">
                <input className="form-check-input" type="checkbox" id={`${feature.id}`}
                  checked={this.isFeatureSelected(feature)}
                  onChange={() => this.onFeatureSelected(feature.id)}
                />
                <label className="form-check-label" htmlFor={`${feature.id}`}>
                  {feature.name}
                </label>
              </div>
            ))
          }

          <h2>Contact</h2>
          <div className="form-group">
            <label htmlFor="contactName">Name</label>
            <input className="form-control" id="contactName" value={this.state.vehicle.contact.name} onChange={this.onNameChange}></input>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.contact.name || !!this.state.vehicle.contact.name}>Please provide your name.</div>

          <div className="form-group">
            <label htmlFor="contactPhone">Phone</label>
            <input className="form-control" id="contactPhone" value={this.state.vehicle.contact.phone} onChange={this.onPhoneChange}></input>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.contact.phone || !!this.state.vehicle.contact.phone}>Please provide your phone number.</div>

          <div className="form-group">
            <label htmlFor="contactEmail">Email</label>
            <input className="form-control" id="contactEmail" value={this.state.vehicle.contact.email} onChange={this.onEmailChange}></input>
          </div>

          <button className="btn btn-primary" disabled={!this.isFormValid()}>Save</button>
        </form>
      </React.Fragment>
    );
  }

  private async fetchMakes() {
    const makesResponse = await fetch('/api/makes');
    const makes = await makesResponse.json();
    this.setState({
      makes
    });
  }

  private async fetchFeatures() {
    const featuresResponse = await fetch('/api/features');
    const features: Feature[] = await featuresResponse.json();
    this.setState({
      features: features.map(f => ({ ...f, isSelected: false }))
    });
  }

  private async onVehicleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.vehicle)
      });
      const createdVehicle = await response.json();
      toast.success('Succesfully saved a vehicle.');
      console.log(createdVehicle);
    } catch (e) {
      toast.error('Unexpected error. Could not save a vehicle.');
    }
  }

  private onMakeChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    let makeId: number | undefined = parseInt(event.currentTarget.value, 10);
    makeId = isNaN(makeId) ? undefined : makeId;
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        makeId,
        modelId: undefined
      },
      formTouched: {
        ...prevState.formTouched,
        makeId: true
      }
    }));
  }

  private onModelChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    let modelId: number | undefined = parseInt(event.currentTarget.value, 10);
    modelId = isNaN(modelId) ? undefined : modelId
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        modelId
      },
      formTouched: {
        ...prevState.formTouched,
        modelId: true
      }
    }));
  }

  private onIsRegisteredChanged() {
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        isRegistered: !prevState.vehicle.isRegistered
      },
      formTouched: {
        ...prevState.formTouched,
        isRegistered: true
      }
    }));
  }

  private onFeatureSelected(featureId: number) {
    this.setState(prevState => {
      const features = [...prevState.vehicle.features];
      if (features.includes(featureId)) {
        const index = features.indexOf(featureId);
        features.splice(index, 1);
      } else {
        features.push(featureId);
      }

      return ({
        vehicle: {
          ...prevState.vehicle,
          features
        },
        formTouched: {
          ...prevState.formTouched,
          features: true
        }
      })
    })
  }

  private onNameChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const name = event.currentTarget.value;
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        contact: {
          ...prevState.vehicle.contact,
          name
        }
      },
      formTouched: {
        ...prevState.formTouched,
        contact: {
          ...prevState.formTouched.contact,
          name: true
        }
      }
    }));
  }

  private onPhoneChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const phone = event.currentTarget.value;
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        contact: {
          ...prevState.vehicle.contact,
          phone
        }
      },
      formTouched: {
        ...prevState.formTouched,
        contact: {
          ...prevState.formTouched.contact,
          phone: true
        }
      }
    }));
  }

  private onEmailChange(event: React.SyntheticEvent<HTMLInputElement>) {
    const email = event.currentTarget.value;
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        contact: {
          ...prevState.vehicle.contact,
          email
        }
      },
      formTouched: {
        ...prevState.formTouched,
        contact: {
          ...prevState.formTouched.contact,
          email: true
        }
      }
    }));
  }

  private isFeatureSelected(feature: Feature): boolean {
    return this.state.vehicle.features.includes(feature.id);
  }

  private isFormValid(): boolean {
    return !!(
      this.state.vehicle.makeId &&
      this.state.vehicle.modelId &&
      this.state.vehicle.contact.name &&
      this.state.vehicle.contact.phone
    );
  }
}

export default VehicleForm;