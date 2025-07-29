import type { ImageLoadDetail } from "./load_image";
import { setImage } from "./overlay";

const overlay = document.getElementById("start-overlay") as HTMLDivElement;

// Listen for the custom event with typed detail
window.addEventListener("image_load", (e) => {
	const event = e as CustomEvent<ImageLoadDetail>;
	
	setImage(event.detail.src, event.detail);
	overlay.style.display = "none";
});
