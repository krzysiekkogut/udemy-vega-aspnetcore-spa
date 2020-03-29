import * as React from 'react';
import { Make } from '../models/make';

interface VehicleFormState {
  makes: Make[];
}

class VehicleForm extends React.PureComponent<{}, VehicleFormState> {
  state: VehicleFormState = {
    makes: []
  }

  async componentDidMount() {
    const makesResponse = await fetch('/api/makes');
    const makes = await makesResponse.json();
    this.setState({
      makes
    });
    console.log(makes);
  }

  public render() {
    return (
      <React.Fragment>
        <h1>New Vehicle</h1>
        <form>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <select id="make" className="form-control">
              <option value=""></option>
              {this.state.makes.map((make: Make) => (<option key={make.id} value={make.id}>{make.name}</option>))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <select id="model" className="form-control"></select>
          </div>
        </form>
      </React.Fragment>
    );
  }
}

export default VehicleForm;