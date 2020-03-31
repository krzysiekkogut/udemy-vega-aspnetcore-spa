import * as React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../models/vehicle';
import { Make } from '../models/make';

import './VehicleList.css';

interface VehicleListState {
  vehicles: Vehicle[];
  makes: Make[];
  query: {
    makeId: number;
    modelId: number;
    sortBy: string;
    isSortDescending: boolean;
  }
}

class VehiclesList extends React.PureComponent<unknown, VehicleListState> {
  state: VehicleListState = {
    vehicles: [],
    makes: [],
    query: {
      makeId: -1,
      modelId: -1,
      sortBy: '',
      isSortDescending: false
    }
  };

  constructor(props: unknown) {
    super(props);

    this.onMakeChanged = this.onMakeChanged.bind(this);
    this.onModelChanged = this.onModelChanged.bind(this);
    this.resetFiltering = this.resetFiltering.bind(this);
  }

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
        <div className="card" style={{ marginBottom: 8 }}>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="make">Make</label>
              <select
                id="make" className="form-control"
                value={this.state.query.makeId}
                onChange={this.onMakeChanged}
              >
                <option value={-1}></option>
                {
                  this.state.makes.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <select
                id="model" className="form-control"
                value={this.state.query.modelId}
                onChange={this.onModelChanged}
              >
                <option value={-1}></option>
                {
                  this.state.query.makeId >= 0 &&
                  this.state.makes.find(m => m.id === this.state.query.makeId)!.models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))
                }
              </select>
            </div>
            <button className="btn btn-secondary" onClick={this.resetFiltering}>Reset</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => this.onQueryChanged('id')}>Id</th>
              <th onClick={() => this.onQueryChanged('make')}>Make</th>
              <th onClick={() => this.onQueryChanged('model')}>Model</th>
              <th onClick={() => this.onQueryChanged('contactName')}>Contact Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.vehicles
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
      </div>
    );
  }

  private async fetchVehicles() {
    let query = this.toQueryString(this.state.query);
    const response = await fetch('/api/vehicles' + (query ? `?${query}` : ''));
    const vehicles = await response.json();
    this.setState({
      vehicles
    })
  }

  private toQueryString(filter: any): string {
    const queryParts = [];
    for (const prop in filter) {
      if (filter.hasOwnProperty(prop)) {
        const value = filter[prop];
        if (value !== null && value !== undefined && value !== -1) {
          queryParts.push(`${encodeURIComponent(prop)}=${encodeURIComponent(value)}`);
        }
      }
    }

    return queryParts.join('&');
  }

  private async fetchMakes() {
    const makesResponse = await fetch('/api/makes');
    const makes = await makesResponse.json();
    this.setState({ makes });
  }

  private onMakeChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const makeId: number = parseInt(event.currentTarget.value, 10);
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        makeId,
        modelId: -1
      }
    }), this.fetchVehicles);
  }

  private onModelChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const modelId: number = parseInt(event.currentTarget.value, 10);
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        modelId
      }
    }), this.fetchVehicles);
  }

  private resetFiltering() {
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        makeId: -1,
        modelId: -1,
      }
    }), this.fetchVehicles);
  }

  private onQueryChanged(sortBy: string) {
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        sortBy,
        isSortDescending: prevState.query.sortBy === sortBy
      }
    }), this.fetchVehicles)
  }
}

export default VehiclesList;
