import { distance } from 'fastest-levenshtein';

type DistObj = {
	target: string;
	distance: number;
};

function isEligDom(splitDom: string[]) {
	return (
		(splitDom.length === 2 || splitDom.length === 3) && splitDom.every((part) => part.length >= 2)
	);
}

function getSortedDist(domainDist: DistObj[], optDist: number) {
	return domainDist
		.filter(({ distance }) => distance <= optDist)
		.sort((prevDom, nextDom) => prevDom.distance - nextDom.distance);
}

function clean(value: string) {
	return value.replace(/\s+/g, '');
}

export function suggest(domains: readonly string[], extensions: readonly string[]) {
	return function (value: string): string | undefined {
		const splitVal = value.split('@');
		const isEligValue = value.length >= 3 + 1 + 3 + 1 + 2 && splitVal.length === 2;

		if (isEligValue) {
			const user: string = splitVal[0];
			const domain: string = splitVal[1];
			const splitDom = domain.split('.');
			const splitDomC = domain.split(',');

			const isEligUser = user.length >= 4;

			if (isEligUser && (isEligDom(splitDom) || isEligDom(splitDomC))) {
				const cleanDom = clean(domain);
				const isNotInclDom = domains.indexOf(cleanDom) === -1;

				if (isNotInclDom) {
					const domainDist: DistObj[] = [];
					for (const target of domains) {
						domainDist.push({
							target,
							distance: distance(cleanDom, target),
						});
					}

					const provider = clean(splitDom[0]);
					let optDist: number;

					if (provider.length <= 3) {
						optDist = 1;
					} else {
						const minDist = Math.floor(cleanDom.length / 2);
						optDist = Math.min(minDist, 3);
					}

					const eligDoms = getSortedDist(domainDist, optDist);

					if (eligDoms.length > 0) {
						return `${user}@${eligDoms[0].target}`;
					}

					const userExt = cleanDom.replace(provider, '');
					const isProviderNotIncl = extensions.indexOf(userExt) === -1;

					if (isProviderNotIncl) {
						const extDists: DistObj[] = [];
						for (const target of extensions) {
							extDists.push({
								target,
								distance: distance(userExt, target),
							});
						}

						const optExtDist = userExt.length >= 4 ? 2 : 1;
						const eligExts = getSortedDist(extDists, optExtDist);

						if (eligExts.length > 0) {
							const bestExts = eligExts.filter(({ distance }) => distance === eligExts[0].distance);
							const betterExts = bestExts.filter(({ target }) => target.length === userExt.length);

							return `${user}@${splitDom[0]}${
								betterExts.length > 0 ? betterExts[0].target : bestExts[0].target
							}`;
						}
					}
				}
			}
		}
	};
}
