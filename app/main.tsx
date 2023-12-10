import { createRoot } from 'react-dom/client';
import { App } from './App';

import './styles/reset.css';
import './styles/app.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
