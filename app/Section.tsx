/* eslint-disable react/jsx-no-target-blank */
const path = 'https://github.com/smastrom/react-bella-email/tree/main/app/Examples/';

type Props = {
	children: React.ReactNode;
	name: string;
	className?: string;
};

export function Section({ children, name, className = '' }: Props) {
	return (
		<section className={`sectionWrapper ${className}`}>
			<div className="sectionContainer">
				<header>
					<h1>{name}</h1>
					<a
						href={`${path}/${name.replaceAll(' ', '')}`}
						target="_blank"
						aria-label="View Source"
						className="codeLink"
					>
						<svg
							className="codeIcon"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<polyline points="16 18 22 12 16 6"></polyline>
							<polyline points="8 6 2 12 8 18"></polyline>
						</svg>
					</a>
				</header>
				<div className="fieldWrapper">{children}</div>
			</div>
		</section>
	);
}
