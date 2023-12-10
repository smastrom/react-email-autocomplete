import { useLayoutEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BasicMode } from './Examples/BasicMode';
import { RefineMode } from './Examples/RefineMode';
import { EventsChildren } from './Examples/EventsChildren';

export function App() {
	useLayoutEffect(() => {
		document.getElementsByTagName('input')[0].focus();
	}, []);

	return (
		<>
			<Header />
			<BasicMode />
			<RefineMode />
			<EventsChildren />
			<Footer />
		</>
	);
}
