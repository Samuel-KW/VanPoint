const dropZone = document.getElementById("drop-zone") as HTMLDivElement;
const fileInput = document.getElementById("file-input") as HTMLInputElement;

export interface ImageLoadDetail {
	src: string;
	width: number;
	height: number;
	scaledWidth: number;
	scaledHeight: number;
}

function handleFile(file: File) {
	const reader = new FileReader();
	const size = Math.min(window.innerWidth, window.innerHeight);

	reader.onload = () => {
		const img = new Image();
		img.onload = () => {

			const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
			const width = img.naturalWidth * scale;
			const height = img.naturalHeight * scale;

			window.dispatchEvent(new CustomEvent("image_load", {
				detail: {
					src: reader.result,
					width: img.naturalWidth,
					height: img.naturalHeight,
					scaledWidth: width,
					scaledHeight: height
				}
			}));
		};
		img.src = reader.result as string;
	};
	reader.readAsDataURL(file);
}

fileInput.addEventListener("change", (event) => {
	const file = (event.target as HTMLInputElement).files?.[0];
	if (file) {
		handleFile(file);
	}
});

dropZone.addEventListener("dragover", (event) => {
	event.preventDefault();
	dropZone.style.borderColor = "#0077ff";
});

dropZone.addEventListener("dragleave", () => {
	dropZone.style.borderColor = "#ccc";
});

dropZone.addEventListener("drop", (event) => {
	event.preventDefault();
	dropZone.style.borderColor = "#ccc";
	const file = event.dataTransfer?.files?.[0];
	if (file) {
		handleFile(file);
	}
});
