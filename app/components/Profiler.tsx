import { Profiler as ReactProfiler, ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (_, phase, actualDuration, startTime, commitTime) => {
	const performanceData = [
		`phase: ${phase}`,
		`actualDuration: ${actualDuration}`,
		`startTime: ${startTime}`,
		`commitTime: ${commitTime}`,
	].join(', ');
	console.info(performanceData);
};

type JSX = {
	children: JSX.Element;
};

export const Profiler = ({ children }: JSX) => (
	<ReactProfiler onRender={onRender} id="react-bella-email">
		{children}
	</ReactProfiler>
);
