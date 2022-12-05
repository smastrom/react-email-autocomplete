import { Header } from './Header';
import { Footer } from './Footer';

import { BasicMode } from './Examples/BasicMode';
import { RefineMode } from './Examples/RefineMode';
import { EventsChildren } from './Examples/EventsChildren';
export function App() {
	return (
		<>
			<div className="wrapper">
				<Header />
				<BasicMode />
				<RefineMode />
				<EventsChildren />
			</div>
			<Footer />
		</>
	);
}
