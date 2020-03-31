import * as React from 'react';
import { Link } from 'react-router-dom';

import { Vehicle } from '../models/vehicle';

interface VehicleListState {
  vehicles: Vehicle[];
}

class VehiclesList extends React.PureComponent<VehicleListState> {
  state = {
    vehicles: []
  };

  async componentDidMount() {
    await this.fetchVehicles();
  }

  public render() {
    return (
      <div>
        <h1>Vehicles List</h1>
        <Link to="/new">
          <button className="btn btn-primary">
            New Vehicle
            </button>
        </Link>
        {this.state.vehicles.length > 0 ? <VehliclesTable vehicles={this.state.vehicles} /> : <p>There are not vehicles saved</p>}
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
}

const VehliclesTable = ({ vehicles }: { vehicles: Vehicle[] }) => {
  return <table className="table">
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
      {vehicles.map(v => (
        <tr>
          <td>{v.id}</td>
          <td>{v.make.name}</td>
          <td>{v.model.name}</td>
          <td>{v.contact.name}</td>
          <td><Link to={`/${v.id}`}>View</Link></td>
        </tr>
      ))}
    </tbody>
  </table>
}

export default VehiclesList;
