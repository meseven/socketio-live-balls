const colors = ['blue', 'green', 'red'];

const randomColor = () => {
	return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;
