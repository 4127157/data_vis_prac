
var winHeight = 0, 
				winWidth = 0, 
				timeout = false, 
				delay = 350;

function setCoreDimensions(){
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
		console.log("Window height: " + winHeight);
		console.log("Window width: " + winWidth);
}

/*This function exists for responsiveness reasons*/
window.addEventListener('resize', () => {
	/*Preventing excessive calls on resize from lagging the view on window resize due to any factor*/
		clearTimeout(timeout);
	
		timeout = setTimeout(setCoreDimensions, delay)
});

/*Changes bar graph to be vertical and have year values on Y and amount on X useful for when height is more than width like in mobile phones*/
function changeOrientation(){
	return 0;
}

