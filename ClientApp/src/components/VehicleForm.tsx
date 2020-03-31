import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { toast } from 'react-toastify';
import { Make } from '../models/make';
import { Feature } from '../models/feature';
import { VehicleForSave as SaveVehicle, getEmptyVehicle, Vehicle } from '../models/vehicle';

import './VehicleForm.css';

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
  vehicle: SaveVehicle;
  formTouched: FormTouchedValidation;
}

type VehicleFormProps = RouteComponentProps<{
  id: string
}>;

class VehicleForm extends React.PureComponent<VehicleFormProps, VehicleFormState> {
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

  constructor(props: VehicleFormProps) {
    super(props);

    this.onMakeChanged = this.onMakeChanged.bind(this);
    this.onModelChanged = this.onModelChanged.bind(this);
    this.onIsRegisteredChanged = this.onIsRegisteredChanged.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onVehicleSubmit = this.onVehicleSubmit.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
  }

  async componentDidMount() {
    const sources = [
      this.fetchMakes(),
      this.fetchFeatures()
    ];

    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id, 10);
      if (!isNaN(id)) {
        sources.push(this.fetchVehicle(id));
      }
    }

    await Promise.all(sources);
  }

  public render() {
    return (
      <React.Fragment>
        <h1>New Vehicle</h1>
        <form onSubmit={this.onVehicleSubmit}>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select id="make" className="form-control" onChange={this.onMakeChanged} value={this.state.vehicle.makeId}>
              <option value={-1}></option>
              {
                this.state.makes.map((make: Make) => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))
              }
            </select>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.makeId || this.state.vehicle.makeId >= 0}>Please specify the make.</div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select id="model" className="form-control" onChange={this.onModelChanged} value={this.state.vehicle.modelId}>
              <option value={-1}></option>
              {
                this.state.vehicle.makeId >= 0 &&
                this.state.makes
                  .find(make => make.id === this.state.vehicle.makeId)!.models
                  .map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))
              }
            </select>
          </div>
          <div className="alert alert-danger" hidden={!this.state.formTouched.modelId || this.state.vehicle.modelId >= 0}>Please specify the model.</div>

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

          <div className="btn-toolbar">
            <div className="btn-group">
              <button className="btn btn-primary" type="submit" disabled={!this.isFormValid()}>Save</button>
            </div>
            <div className="btn-group">
              <button className="btn btn-danger" type="button" hidden={!this.state.vehicle.id} onClick={this.deleteVehicle}>Delete</button>
            </div>
          </div>
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

  private async fetchVehicle(id: number) {
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      const vehicle = await response.json();
      this.setState({
        vehicle: this.mapVehicleToFormObject(vehicle)
      })
    } catch (e) {
      this.props.history.push('/');
    }
  }

  private mapVehicleToFormObject(vehicle: Vehicle): SaveVehicle {
    return {
      id: vehicle.id,
      makeId: vehicle.make.id,
      modelId: vehicle.model.id,
      isRegistered: vehicle.isRegistered,
      contact: { ...vehicle.contact },
      features: vehicle.features.map(f => f.id)
    }
  }

  private async onVehicleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    const url = '/api/vehicles/' + (this.state.vehicle.id ? `${this.state.vehicle.id}` : '');
    const method = this.state.vehicle.id ? 'PUT' : 'POST'

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.vehicle)
      });
      this.props.history.push('/');
      toast.success('Succesfully saved a vehicle.');
    } catch (e) {
      toast.error('Unexpected error. Could not save a vehicle.');
    }
  }

  private async deleteVehicle() {
    if (window.confirm("Do you really want to delete this vehicle?")) {
      try {
        await fetch(`/api/vehicles/${this.state.vehicle.id}`, { method: 'DELETE' });
        toast.success('Succesfully deleted a vehicle.');
        this.props.history.push('/');
      } catch (error) {
        toast.error('Could not deleted a vehicle.');
      }
    }
  }

  private onMakeChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const makeId: number = parseInt(event.currentTarget.value, 10);
    this.setState(prevState => ({
      vehicle: {
        ...prevState.vehicle,
        makeId,
        modelId: -1
      },
      formTouched: {
        ...prevState.formTouched,
        makeId: true
      }
    }));
  }

  private onModelChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const modelId: number = parseInt(event.currentTarget.value, 10);
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
      this.state.vehicle.makeId >= 0 &&
      this.state.vehicle.modelId >= 0 &&
      this.state.vehicle.contact.name &&
      this.state.vehicle.contact.phone
    );
  }
}

export default withRouter(VehicleForm);