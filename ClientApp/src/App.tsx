import * as React from 'react';
import { Route, Switch } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import VehicleForm from './components/VehicleForm';

import './custom.css'

export default () => (
  <Layout>
    <Switch>
      <Route exact path='/' component={Home} />
      <Route exact path='/vehicle/new' component={VehicleForm} />
      <Route path='/vehicle/:id' component={VehicleForm} />
    </Switch>
  </Layout>
);
