function SceneCube()
{

}


SceneCube.prototype.getGeometry = function()
{
	var p000 = new Vector3([-1, -1, -1]);
	var p001 = new Vector3([-1, -1,  1]);
	var p010 = new Vector3([-1,  1, -1]);
	var p011 = new Vector3([-1,  1,  1]);
	var p100 = new Vector3([ 1, -1, -1]);
	var p101 = new Vector3([ 1, -1,  1]);
	var p110 = new Vector3([ 1,  1, -1]);
	var p111 = new Vector3([ 1,  1,  1]);
	
	var model = {};
	model.matrix = Matrix4x4.translation(0, 0, 0);
	model.trianglefans =
	[
		[ p000, p100, p110, p010 ],
		[ p001, p101, p111, p011 ],
		[ p000, p010, p011, p001 ],
		[ p100, p110, p111, p101 ],
		[ p000, p001, p101, p100 ],
		[ p010, p011, p111, p110 ]
	];
	
	var scene = {}
	scene.models = [ model ];
	
	return scene;
}