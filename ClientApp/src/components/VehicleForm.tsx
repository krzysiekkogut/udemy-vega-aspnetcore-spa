import * as React from 'react';
import { Make } from '../models/make';
import { Feature } from '../models/feature';

interface VehicleFormState {
  makes: Make[];
  features: Feature[];
  selectedMake?: Make;
}

class VehicleForm extends React.PureComponent<{}, VehicleFormState> {
  state: VehicleFormState = {
    makes: [],
    features: [],
  }

  constructor(props: {}) {
    super(props);

    this.onMakeChanged = this.onMakeChanged.bind(this);
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
            <select id="make" className="form-control" onChange={this.onMakeChanged}>
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

          <h2>Features</h2>
          {
            this.state.features.map(feature => (
              <div key={feature.id} className="form-group form-check">
                <input className="form-check-input" type="checkbox" id={`${feature.id}`} />
                <label className="form-check-label" htmlFor={`${feature.id}`}>
                  {feature.name}
                </label>
              </div>
            ))
          }
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
    const features = await featuresResponse.json();
    this.setState({
      features
    });
  }

  private onMakeChanged(changeEvent: React.SyntheticEvent<HTMLSelectElement>) {
    const selectedMake = this.state.makes.find(
      make => make.id === parseInt(changeEvent.currentTarget.value, 10)
    );
    this.setState({ selectedMake });
  }
}

export default VehicleForm;