(function () {

	var options =
	{
		size: [400, 300, 200, 100],
		weight: [28, 23, 18, 13],
		color: '#41424C',
		duration: [1.1, 1.2, 1.3, 1.4],
		delay: 0.05,
		fade: 1.5,
		easing: d3_ease.easeExpInOut.ease
	}
	function init() {
		var word = document.querySelector('.my_text'),
			instance = new Letters(word, options),
			endPlayCallback = function () {
				word.setAttribute('data-state', 'stop');
			};
		instance.showInstantly();
		var timeline = {};
		var letters = [].slice.call(word.querySelectorAll('svg')),
			lettersTotal = letters.length,
			distanceFactor = 40;
		timeline = new mojs.Timeline();
		letters.forEach(function (letter, i) {
			var ty = -1 * distanceFactor * (lettersTotal - i)
			tween = new mojs.Tween({
				duration: 2000,
				delay: 50 + 50 * i,
				easing: mojs.easing.elastic.out,
				onUpdate: function (progress) {
					letter.style.WebkitTransform = letter.style.transform = 'translate3d(0,' + ty * (1 - progress) + '%,0)';
				}
			});
			timeline.add(tween);
		});
		instance.hideInstantly();
		timeline.start();
		instance.show({ callback: endPlayCallback });
	}

	init();
})();
