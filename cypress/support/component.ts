/* eslint-disable @typescript-eslint/no-namespace */
import { mount } from 'cypress/react';

import './commands';
import '../../app/styles/app.css';
import '../../app/styles/fonts.css';
import '../../app/styles/input.css';
import '../../app/styles/preflight.css';

Cypress.Commands.add('mount', mount);
