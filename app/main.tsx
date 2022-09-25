import ReactDOM from 'react-dom';
import { App } from './components/App';

import './styles/preflight.css';
import './styles/index.css';
import './styles/base.css';
import './styles/fonts.css';
import './styles/input.css';

ReactDOM.render(
	/* 	<StrictMode> */
	<App />,
	/* </StrictMode> */ document.getElementById('root')
);
