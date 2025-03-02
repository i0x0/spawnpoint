import React from 'react';

const GlowingDotWithTooltip = ({ variant = "success", tooltipText = "Status: Online" }) => {
	// Mapping for different status variants
	const colorMap = {
		success: "green",
		error: "red",
		warning: "yellow",
		info: "blue"
	};

	// Define static classes based on variant
	const getAnimationColor = () => {
		switch (variant) {
			case "error":
				return "bg-red-400";
			case "warning":
				return "bg-yellow-400";
			case "info":
				return "bg-blue-400";
			default:
				return "bg-green-400";
		}
	};

	const getDotColor = () => {
		switch (variant) {
			case "error":
				return "bg-red-500";
			case "warning":
				return "bg-yellow-500";
			case "info":
				return "bg-blue-500";
			default:
				return "bg-green-500";
		}
	};

	return (
		<div className="group relative">
			<span className="relative flex h-5 w-5">
				<span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${getAnimationColor()} opacity-75`}></span>
				<span className={`relative inline-flex rounded-full h-5 w-5 ${getDotColor()}`}></span>
			</span>

			{/* Tooltip */}
			<div className="invisible group-hover:visible absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap">
				{tooltipText}
				{/* Tooltip arrow */}
				<div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
			</div>
		</div>
	);
};

export default GlowingDotWithTooltip;