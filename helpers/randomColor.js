const randomColorRGB = function() {
	return Math.round(Math.random() * 1000) % 256;
}

const randomColor = () => {
	var r = randomColorRGB();
	var g = randomColorRGB();
	var b = randomColorRGB();
	return `rgb(${r},${g}, ${b})`;
};

module.exports = randomColor;
