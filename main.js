var animate = false;
var scene = null;
var renderMode = null;
var renderProjection = 0;

var screenWidth = 60;
var screenHeight = 35;
var animateInterval = null;
var frame = 0;

var scenes =
[
	function() { return new SceneCube(); }
];

var renderModes =
[
	function() { return new RenderModeWireframe(); }
];


function load()
{
	refreshScene();
	refreshRenderMode();
	refreshProjection();
	refreshAnimate();
	animateInterval = setInterval(function() { loop(); }, 1000 / 30);
}


function loop()
{
	if (!animate)
		return;
	
	step();
	redraw();
}


function step()
{
	frame++;
}


function redraw()
{
	var x =  Math.cos(frame * 0.02) * 3;
	var y = -Math.sin(frame * 0.02) * 3;
	var z =  Math.cos(frame * 0.05) * 3;
	
	var projection;
	switch (renderProjection)
	{
		case 0: projection = Matrix4x4.perspective(70 * 3.14159 / 180, 1, 0.1, 4); break;
		case 1: projection = Matrix4x4.ortho(-2, 2, -2, 2, -2, 2); break;
	}
	
	var view = Matrix4x4.lookat(
		new Vector3([ x, y,  z ]),
		new Vector3([ 0, 0,  0 ]),
		new Vector3([ 0, 0, -1 ]));
		
	var matrix = projection.mulMatrix(view);
	
	if (renderMode != null && scene != null)
		renderMode.render(matrix);
}


function refreshAnimate()
{
	var checkbox = document.getElementById("checkboxAnimate");
	animate = checkbox.checked;
	redraw();
}


function refreshScene()
{
	var selector = document.getElementById("selectScene");
	scene = scenes[selector.selectedIndex]();
	redraw();
}


function refreshRenderMode()
{
	var selector = document.getElementById("selectRenderMode");
	renderMode = renderModes[selector.selectedIndex]();
	redraw();
}


function refreshProjection()
{
	var selector = document.getElementById("selectProjection");
	renderProjection = selector.selectedIndex;
	redraw();
}