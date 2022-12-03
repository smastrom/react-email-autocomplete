/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { mount } from 'cypress/react';

import './commands';
import '../../app/styles/app.css';
import '../../app/styles/fonts.css';
import '../../app/styles/input.css';
import '../../app/styles/preflight.css';

Cypress.Commands.add('mount', mount);
