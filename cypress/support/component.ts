import 'cypress-real-events';
import 'cypress-axe';
import './commands';

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomIndex(length: number) {
	return Math.floor(Math.random() * length);
}
