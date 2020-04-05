import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '../models/vehicle';
import { Make } from '../models/make';

interface VehicleListState {
  vehicles: Vehicle[];
  totalVehiclesCount: number;
  makes: Make[];
  query: {
    makeId: number;
    modelId: number;
    sortBy: string;
    isSortDescending: boolean;
    page: number;
    pageSize: number;
  }
}

class VehiclesList extends React.PureComponent<unknown, VehicleListState> {
  state: VehicleListState = {
    vehicles: [],
    totalVehiclesCount: 0,
    makes: [],
    query: {
      makeId: -1,
      modelId: -1,
      sortBy: '',
      isSortDescending: false,
      page: 1,
      pageSize: 4,
    }
  };

  private columns = [
    {
      title: 'Id',
      key: 'id',
      getColumnValue: (v: Vehicle): any => v.id
    },
    {
      title: 'Make',
      key: 'make',
      getColumnValue: (v: Vehicle): any => v.make.name
    },
    {
      title: 'Model',
      key: 'model',
      getColumnValue: (v: Vehicle): any => v.model.name
    },
    {
      title: 'Contact Name',
      key: 'contactName',
      getColumnValue: (v: Vehicle): any => v.contact.name
    }
  ]

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
              {
                this.columns.map(c => (
                  <th key={c.key} className="pointer" onClick={() => this.onSortChanged(c.key)}>
                    {c.title}&nbsp;
                    {
                      this.state.query.sortBy === c.key &&
                      <FontAwesomeIcon icon={this.state.query.isSortDescending ? faSortDown : faSortUp} />
                    }
                  </th>))
              }
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.vehicles
                .map(v => (
                  <tr key={v.id}>
                    {
                      this.columns.map(c => (
                        <td key={c.key}>{c.getColumnValue(v)}</td>
                      ))
                    }
                    <td><Link to={`/${v.id}`}>View</Link></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
        <div className="btn=group">
          {
            [...Array(Math.ceil(this.state.totalVehiclesCount / this.state.query.pageSize)).keys()].map(p => p + 1).map(page => (
              <button
                className={`btn ${page === this.state.query.page ? 'btn-primary' : 'btn-light'}`}
                onClick={() => this.onPageChanged(page)}
                key={page}
              >
                {page}
              </button>
            ))
          }
        </div>
      </div>
    );
  }

  private async fetchVehicles() {
    let query = this.toQueryString(this.state.query);
    const response = await fetch('/api/vehicles' + (query ? `?${query}` : ''));
    const result = await response.json();
    this.setState({ vehicles: result.items, totalVehiclesCount: result.totalCount });
  }

  private toQueryString(filter: any): string {
    const queryParts = [];
    for (const prop in filter) {
      if (filter.hasOwnProperty(prop)) {
        const value = filter[prop];
        if (value !== null && value !== undefined && value !== -1 && value !== '') {
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
        modelId: -1,
        page: 1
      }
    }), this.fetchVehicles);
  }

  private onModelChanged(event: React.SyntheticEvent<HTMLSelectElement>) {
    const modelId: number = parseInt(event.currentTarget.value, 10);
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        modelId,
        page: 1
      }
    }), this.fetchVehicles);
  }

  private resetFiltering() {
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        makeId: -1,
        modelId: -1,
        page: 1
      }
    }), this.fetchVehicles);
  }

  private onSortChanged(sortBy: string) {
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        sortBy,
        isSortDescending: prevState.query.sortBy === sortBy ? !prevState.query.isSortDescending : false
      }
    }), this.fetchVehicles)
  }

  private onPageChanged(page: number) {
    this.setState(prevState => ({
      query: {
        ...prevState.query,
        page
      }
    }), this.fetchVehicles)
  }
}

export default VehiclesList;
