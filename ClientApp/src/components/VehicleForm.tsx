import * as React from 'react';
import { Make } from '../models/make';
import { Feature } from '../models/feature';

interface IsSelected {
  isSelected: boolean
}

interface VehicleFormState {
  makes: Make[];
  features: Array<Feature & IsSelected>;
  selectedMake?: Make;
  isRegistered: boolean;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

class VehicleForm extends React.PureComponent<{}, VehicleFormState> {
  state: VehicleFormState = {
    makes: [],
    features: [],
    isRegistered: true,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  }

  constructor(props: {}) {
    super(props);

    this.onMakeChanged = this.onMakeChanged.bind(this);
    this.onIsRegisteredChanged = this.onIsRegisteredChanged.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
  }

  async componentDidMount() {
    await this.fetchMakes();
    await this.fetchFeatures();
  }

  public render() {
    return (
      <React.Fragment>
        <h1>New Vehicle</h1>
        <form>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select id="make" className="form-control" onChange={this.onMakeChanged} value={this.state.selectedMake && this.state.selectedMake.id}>
              <option value=""></option>
              {
                this.state.makes.map((make: Make) => (
                  <option key={make.id} value={make.id}>{make.name}</option>
                ))
              }
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select id="model" className="form-control">
              <option value=""></option>
              {
                this.state.selectedMake && this.state.selectedMake.models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))
              }
            </select>
          </div>

          <p>Is this vehicle registered?</p>
          <div className="form-group form-check">
            <input className="form-check-input" type="radio" id="registered_yes" checked={this.state.isRegistered} onChange={this.onIsRegisteredChanged} value="true" />
            <label className="form-check-label" htmlFor="registered_yes">Yes</label>
          </div>
          <div className="form-group form-check">
            <input className="form-check-input" type="radio" id="registered_no" checked={!this.state.isRegistered} onChange={this.onIsRegisteredChanged} value="false" />
            <label className="form-check-label" htmlFor="registered_no">No</label>
          </div>

          <h2>Features</h2>
          {
            this.state.features.map(feature => (
              <div key={feature.id} className="form-group form-check">
                <input className="form-check-input" type="checkbox" id={`${feature.id}`} checked={feature.isSelected} onChange={() => this.onFeatureSelected(feature)} />
                <label className="form-check-label" htmlFor={`${feature.id}`}>
                  {feature.name}
                </label>
              </div>
            ))
          }

          <h2>Contact</h2>
          <div className="form-group">
            <label htmlFor="contactName">Name</label>
            <input className="form-control" id="contactName" value={this.state.contactName} onChange={this.onNameChange}></input>
          </div>
          <div className="form-group">
            <label htmlFor="contactPhone">Phone</label>
            <input className="form-control" id="contactPhone" value={this.state.contactPhone} onChange={this.onPhoneChange}></input>
          </div>
          <div className="form-group">
            <label htmlFor="contactEmail">Email</label>
            <input className="form-control" id="contactEmail" value={this.state.contactEmail} onChange={this.onEmailChange}></input>
          </div>

          <button className="btn btn-primary">Save</button>
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

  private onMakeChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const selectedMake = this.state.makes.find(
      make => make.id === parseInt(event.currentTarget.value, 10)
    );
    this.setState({ selectedMake });
  }

  private onIsRegisteredChanged(event: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ isRegistered: event.currentTarget.value === 'true' })
  }

  private onFeatureSelected(feature: Feature & IsSelected) {
    this.setState((prevState) => ({
      features: prevState.features.map(f => ({
        ...f,
        isSelected: f.id === feature.id ? !f.isSelected : f.isSelected
      }))
    }))
  }

  private onNameChange(event: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ contactName: event.currentTarget.value });
  }

  private onPhoneChange(event: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ contactPhone: event.currentTarget.value });
  }

  private onEmailChange(event: React.SyntheticEvent<HTMLInputElement>) {
    this.setState({ contactEmail: event.currentTarget.value });
  }
}

export default VehicleForm;