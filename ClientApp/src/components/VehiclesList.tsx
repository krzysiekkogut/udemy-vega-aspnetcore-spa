import * as React from 'react';
import { Link } from 'react-router-dom';

import { Vehicle } from '../models/vehicle';
import { Make } from '../models/make';

interface VehicleListState {
  vehicles: Vehicle[];
  makes: Make[];
}

class VehiclesList extends React.PureComponent<VehicleListState> {
  state = {
    vehicles: [],
    makes: []
  };

  async componentDidMount() {
    await Promise.all([
      this.fetchVehicles(),
      this.fetchMakes()
    ]);
  }

  public render() {
    return (
      <div>
        <h1>Vehicles List</h1>
        <div style={{ marginBottom: 8 }}>
          <Link to="/new">
            <button className="btn btn-primary">
              New Vehicle
            </button>
          </Link>
        </div>
        {this.state.vehicles.length > 0 ? <VehliclesTable vehicles={this.state.vehicles} makes={this.state.makes} /> : <p>There are not vehicles saved</p>}
      </div>
    );
  }

  private async fetchVehicles() {
    const response = await fetch('/api/vehicles');
    const vehicles = await response.json();
    this.setState({
      vehicles
    })
  }

  private async fetchMakes() {
    const makesResponse = await fetch('/api/makes');
    const makes = await makesResponse.json();
    this.setState({
      makes
    });
  }
}

const VehliclesTable = ({ vehicles, makes }: { vehicles: Vehicle[], makes: Make[] }) => {
  const [filter, setFilter] = React.useState<{ makeId: number, modelId: number }>({
    makeId: -1,
    modelId: -1
  });

  const selectedMake = makes.find(m => m.id === filter.makeId);

  let filteredVehicles = vehicles;
  if (filter.makeId >= 0) {
    filteredVehicles = filteredVehicles.filter(v => v.make.id === filter.makeId);
  }

  if (filter.modelId >= 0) {
    filteredVehicles = filteredVehicles.filter(v => v.model.id === filter.modelId);
  }

  return (<React.Fragment>
    <div className="card" style={{ marginBottom: 8 }}>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <select
            id="make" className="form-control"
            value={filter.makeId}
            onChange={(e) => setFilter({ makeId: e.target.value ? parseInt(e.target.value) : -1, modelId: -1 })}
          >
            <option value={-1}></option>
            {
              makes.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))
            }
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <select
            id="model" className="form-control"
            value={filter.modelId}
            onChange={(e) => setFilter({ makeId: filter.makeId, modelId: e.target.value ? parseInt(e.target.value) : -1 })}
          >
            <option value={-1}></option>
            {
              selectedMake && selectedMake.models.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))
            }
          </select>
        </div>
        <button className="btn btn-secondary" onClick={() => setFilter({ makeId: -1, modelId: -1 })}>Reset</button>
      </div>
    </div>
    <table className="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Make</th>
          <th>Model</th>
          <th>Contact Name</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          filteredVehicles
            .map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.make.name}</td>
                <td>{v.model.name}</td>
                <td>{v.contact.name}</td>
                <td><Link to={`/${v.id}`}>View</Link></td>
              </tr>
            ))
        }
      </tbody>
    </table>
  </React.Fragment>)
}

export default VehiclesList;
