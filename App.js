import React from 'react';
import { render } from 'react-dom';
import Rover from './rover';
import './node_modules/bootstrap/dist/css/bootstrap.min.css';

render(
  <Rover />,
  document.getElementById('app')
);