import * as React from 'react';
import { toast } from 'react-toastify';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Vehicle } from '../models/vehicle';
import { Photo } from '../models/photo';

type ViewVehicleProps = RouteComponentProps<{
  id?: string;
}>;


interface ViewVehicleState {
  tabSelected: string;
  vehicle?: Vehicle;
  photos: Photo[];
}

class ViewVehicle extends React.Component<ViewVehicleProps, ViewVehicleState> {
  state: ViewVehicleState = {
    tabSelected: 'vehicle',
    photos: []
  };

  constructor(props: ViewVehicleProps) {
    super(props);
    this.onEditVehicle = this.onEditVehicle.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
    this.uploadPhoto = this.uploadPhoto.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id) {
      const id = parseInt(this.props.match.params.id, 10);
      if (!isNaN(id)) {
        await Promise.all([
          this.fetchVehicle(id),
          this.fetchPhotos(id)
        ]);
      }
    }
  }

  public render() {
    return (
      <React.Fragment>
        <h1>View Vehicle</h1>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${this.state.tabSelected === 'vehicle' ? 'active' : ''}`}
              onClick={() => this.onTabChanged('vehicle')}
            >
              Vehicle
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${this.state.tabSelected === 'photos' ? 'active' : ''}`}
              onClick={() => this.onTabChanged('photos')}
            >
              Photos
            </button>
          </li>
        </ul>
        <div className="tab-container" hidden={this.state.tabSelected !== 'vehicle'}>
          {
            this.state.vehicle &&
            <React.Fragment>
              <h2>Data</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="bold">Make</td>
                    <td>{this.state.vehicle.make.name}</td>
                  </tr>
                  <tr>
                    <td className="bold">Model</td>
                    <td>{this.state.vehicle.model.name}</td>
                  </tr>
                  <tr>
                    <td className="bold">Contact name</td>
                    <td>{this.state.vehicle.contact.name}</td>
                  </tr>
                  <tr>
                    <td className="bold">Contact phone</td>
                    <td>{this.state.vehicle.contact.phone}</td>
                  </tr>
                  {
                    !!this.state.vehicle.contact.email &&
                    <tr>
                      <td className="bold">Contact email</td>
                      <td>{this.state.vehicle.contact.email}</td>
                    </tr>
                  }
                  <tr>
                    <td>Is registered</td>
                    <td>
                      <FontAwesomeIcon
                        title={this.state.vehicle.isRegistered ? 'Yes' : 'No'}
                        icon={this.state.vehicle.isRegistered ? faCheck : faTimes}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bold">Features</td>
                    <td>
                      <ul>
                        {
                          this.state.vehicle.features.map(f => (
                            <li key={f.id}>{f.name}</li>
                          ))
                        }
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="btn-group">
                <button className="btn btn-primary" onClick={this.onEditVehicle}>Edit</button>
                <button className="btn btn-danger" onClick={this.deleteVehicle}>Delete</button>
                <Link to="/"><button className="btn btn-light">View all vehicles</button></Link>
              </div>
            </React.Fragment>
          }
        </div>
        <div className="tab-container" hidden={this.state.tabSelected !== 'photos'}>
          <h2>Photos</h2>
          <input type="file" onChange={this.uploadPhoto} />
          <div>
            {
              this.state.photos.map(p => (
                <img key={p.id} src={`/uploads/${p.fileName}`} width={300} className="img-thumbnail" />
              ))
            }
          </div>
        </div>
      </React.Fragment>
    );
  }

  private async fetchVehicle(id: number) {
    const response = await fetch(`/api/vehicles/${id}`);
    if (!response.ok) {
      this.props.history.push('/');
    }
    const vehicle = await response.json();
    this.setState({ vehicle });
  }

  private async fetchPhotos(id: number) {
    const response = await fetch(`/api/vehicles/${id}/photos`);
    const photos = await response.json();
    this.setState({ photos });
  }

  private onEditVehicle() {
    this.props.history.push(`${this.state.vehicle!.id}/edit`);
  }

  private async deleteVehicle() {
    if (window.confirm("Do you really want to delete this vehicle?")) {
      try {
        await fetch(`/api/vehicles/${this.state.vehicle!.id}`, { method: 'DELETE' });
        toast.success('Succesfully deleted a vehicle.');
        this.props.history.push('/');
      } catch (error) {
        toast.error('Could not deleted a vehicle.');
      }
    }
  }

  private onTabChanged(tabSelected: string) {
    this.setState({ tabSelected });
  }

  private async uploadPhoto(event: React.SyntheticEvent<HTMLInputElement>) {
    if ((event.target as HTMLInputElement).files!.length === 0) {
      return;
    }

    const fileFormData = new FormData();
    fileFormData.append('file', (event.target as HTMLInputElement).files![0]);
    (event.target as HTMLInputElement).value = '';

    try {
      const response = await fetch(`/api/vehicles/${this.state.vehicle!.id}/photos`, {
        method: 'POST',
        body: fileFormData,
      });

      if (!response.ok) {
        toast.error(await response.text());
      } else {
        const photo = await response.json();
        this.setState(prevState => ({
          photos: [...prevState.photos, photo]
        }))
      }
    } catch (e) {
      toast.error('Could not upload an image.');
    }
  }
}

export default withRouter(ViewVehicle);