import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import VehiclesList from './components/VehiclesList';
import VehicleForm from './components/VehicleForm';
import ViewVehicle from './components/ViewVehicle';

import './custom.css'

export default () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={VehiclesList} />
      <Route exact path='/new' component={VehicleForm} />
      <Route path='/:id/edit' component={VehicleForm} />
      <Route path='/:id' component={ViewVehicle} />
    </Switch>
  </Layout>
);
