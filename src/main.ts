import "./styles/variables.dark.forest.css"
import "./styles/global.css"
import "./ui/components/toolbar/toolbar.ts"
import "./ui/components/interface/interface.ts"
import "./ui/components/propertyMenu/property.ts"
import "./ui/components/widgets/widgets.ts"
import "./ui/components/viewport/viewport.ts"
import AddonManager from "./core/manager";
import { loadInitialAddons } from "./ui/components/addonLoaderScreen/loader";
import { ViewportAddon } from "./addons/viewport/ViewportAddon";
import { GeometryAddon } from "./addons/geometry/GeometryAddon.ts";
import { PreviewAddon } from "./addons/preview/PreviewAddon.ts";
import { DebugBordersAddon } from "./addons/debugBorders/BordersAddon.ts";
import { DirectionSphereAddon } from "./addons/directionSphere/DirectionSphereAddon.ts";
import { VapidAddon } from "./addons/vapid/VapidAddon.ts";
import { ImageSelectorAddon } from "./addons/imageSelector/ImageSelectorAddon.ts";
import { CalibrationAddon } from "./addons/calibration/calibration.ts";
import { OverlayAddon } from "./addons/overlay/overlay.ts";

const debug = true;

export const avaliableAddons = [
	ViewportAddon, GeometryAddon, PreviewAddon, VapidAddon, ImageSelectorAddon,
	DebugBordersAddon, DirectionSphereAddon, CalibrationAddon
];

export const addons = {
	core: [ ViewportAddon, GeometryAddon, PreviewAddon, ImageSelectorAddon, CalibrationAddon, OverlayAddon ],
	extended: [],
	custom: [],
	debug: [ DebugBordersAddon ]
};

const manager = new AddonManager(debug);
const instances = await loadInitialAddons(manager, addons, debug);

if (debug) {
	let debugState = true;
	document.addEventListener("keydown", (e) => {
		if (e.key === "`") {
			debugState = !debugState;
			for (const addon of instances.debug.values()) {
				if (debugState) {
					manager.enable(addon);
				} else {
					manager.disable(addon);
				}
			}
		}
	});
}
