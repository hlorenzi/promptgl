function Matrix4x4(cells)
{
	this.m = cells;
}


Matrix4x4.identity = function()
{
	return new Matrix4x4(
	[
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
	]);
}


Matrix4x4.translation = function(x, y, z)
{
	return new Matrix4x4(
	[
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[x, y, z, 1]
	]);
}


Matrix4x4.rotation = function(x, y, z, radians)
{
	var c = Math.cos(radians);
	var s = Math.sin(radians);
	var t = 1 - c;

	return new Matrix4x4(
	[
		[t*x*x + c,    t*x*y - z*s,  t*x*z + y*s, 0],
		[t*x*y + z*s,  t*y*y + c,    t*y*z - x*s, 0],
		[t*x*z - y*s,  t*y*z + x*s,  t*z*z + c,   0],
		[          0,            0,          0,   1]
	]);
}


Matrix4x4.ortho = function(left, right, top, bottom, near, far)
{
	return new Matrix4x4(
	[
		[               2 / (right - left),                                0,                            0, 0 ],
		[                                0,               2 / (top - bottom),                            0, 0 ],
		[                                0,                                0,            -2 / (far - near), 0 ],
		[ -(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1 ]
	]);
}


Matrix4x4.frustum = function(left, right, top, bottom, near, far)
{
	return new Matrix4x4(
	[
		[      2 * near / (right - left),                               0,                                0,  0],
		[                              0,       2 * near / (top - bottom),                                0,  0],
		[(right + left) / (right - left), (top + bottom) / (top - bottom),     -(far + near) / (far - near), -1],
		[                              0,                               0, -(2 * far * near) / (far - near),  0]
	]);
}


Matrix4x4.perspective = function(fovyRadians, aspectWidthByHeight, near, far)
{
	var h = Math.tan(fovyRadians) * near;
	var w = h * aspectWidthByHeight;
	return Matrix4x4.frustum(-w, w, -h, h, near, far);
}


Matrix4x4.lookat = function(eye, target, up)
{
	var zaxis = (eye.sub(target)).normalized();
	var xaxis = up.cross(zaxis).normalized();
	var yaxis = zaxis.cross(xaxis);

	return new Matrix4x4(
	[
		[      xaxis.m[0],      yaxis.m[0],      zaxis.m[0], 0 ],
		[      xaxis.m[1],      yaxis.m[1],      zaxis.m[1], 0 ],
		[      xaxis.m[2],      yaxis.m[2],      zaxis.m[2], 0 ],
		[ -xaxis.dot(eye), -yaxis.dot(eye), -zaxis.dot(eye), 1 ]
	]).transpose();
}


Matrix4x4.prototype.transpose = function()
{
	return new Matrix4x4(
	[
		[ this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0] ],
		[ this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1] ],
		[ this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2] ],
		[ this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3] ]
	]);
}


Matrix4x4.prototype.mulMatrix = function(other)
{
	var result =
	[
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	];

	for (var j = 0; j < 4; j++)
	{
		for (var i = 0; i < 4; i++)
		{
			var acc = 0;
			for (var k = 0; k < 4; k++)
			{
				acc += this.m[j][k] * other.m[k][i];
			}
			result[j][i] = acc;
		}
	}
	
	return new Matrix4x4(result);
}


Matrix4x4.prototype.mulVector = function(vec)
{
	var v = [vec.m[0], vec.m[1], vec.m[2], 1];
	var result = [0, 0, 0, 0];

	for (var i = 0; i < 4; i++)
	{
		var acc = 0;
		for (var k = 0; k < 4; k++)
		{
			acc += this.m[i][k] * v[k];
		}
		result[i] = acc;
	}

	return result;
}