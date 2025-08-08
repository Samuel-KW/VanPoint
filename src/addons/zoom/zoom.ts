function drawZoomedSquare(
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D,
	imageData: {
		file: File;
		image: HTMLImageElement;
		src: string;
		width: number;
		height: number;
	},
	position: [number, number],
	zoomFactor = 3
): void {
	const [x, y] = position;
	const canvasSize = canvas.width; // assume square
	const sampleSize = canvasSize / zoomFactor;

	// Top-left corner of the sample region in image space
	const sampleX = x - sampleSize / 2;
	const sampleY = y - sampleSize / 2;

	// Create a temporary offscreen canvas to draw the zoom region
	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = sampleSize;
	tempCanvas.height = sampleSize;
	const tempCtx = tempCanvas.getContext('2d')!;

	// Fill with black in case image region is partially out of bounds
	tempCtx.fillStyle = 'black';
	tempCtx.fillRect(0, 0, sampleSize, sampleSize);

	// Compute what part of the image is within bounds
	const sx = Math.max(0, sampleX);
	const sy = Math.max(0, sampleY);
	const sWidth = Math.min(imageData.width - sx, sampleSize - Math.max(0, -sampleX));
	const sHeight = Math.min(imageData.height - sy, sampleSize - Math.max(0, -sampleY));

	const dx = Math.max(0, -sampleX);
	const dy = Math.max(0, -sampleY);

	if (sWidth > 0 && sHeight > 0) {
		tempCtx.drawImage(
			imageData.image,
			sx, sy,               // Source x, y
			sWidth, sHeight,      // Source width, height
			dx, dy,               // Destination x, y
			sWidth, sHeight       // Destination width, height
		);
	}

	// Now draw the zoomed version on the main canvas
	ctx.drawImage(tempCanvas, 0, 0, canvasSize, canvasSize);
}
