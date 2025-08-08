export function stats3D(parent: HTMLElement) {
	const statsClass = require("three/examples/jsm/libs/stats.module.js");
	const stats = new statsClass();
	stats.dom.style = "position:absolute;cursor:pointer;opacity:0.9;top:0;left:5em;z-index:7;";
	parent.appendChild(stats.dom);
	return stats;
}