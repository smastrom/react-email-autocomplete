import { Header } from './Header';
import { Footer } from './Footer';
import { EventsChildren } from '../Examples/EventsChildren';

export function App() {
	return (
		<>
			<div className="wrapper">
				<Header />
				<EventsChildren />
			</div>
			<Footer />
		</>
	);
}
