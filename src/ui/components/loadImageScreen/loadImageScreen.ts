import { context } from "../../../core/context";

let imageSrc: string | null = null;
context.events.on("image:load", ({ src }: { src: string; }) => {
	if (imageSrc) {
		URL.revokeObjectURL(imageSrc);
	}
	imageSrc = src;
});