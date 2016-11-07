function Vector3(elems)
{
	this.m = elems;
}


Vector3.prototype.magn = function()
{
	var x = this.m[0];
	var y = this.m[1];
	var z = this.m[2];
	
	return Math.sqrt(x * x + y * y + z * z);
}


Vector3.prototype.normalized = function()
{
	var x = this.m[0];
	var y = this.m[1];
	var z = this.m[2];
	var magn = this.magn();
	
	return new Vector3([x / magn, y / magn, z / magn]);
}


Vector3.prototype.neg = function()
{
	return new Vector3([-this.m[0], -this.m[1], -this.m[2]]);
}


Vector3.prototype.sub = function(other)
{
	return new Vector3([
		this.m[0] - other.m[0],
		this.m[1] - other.m[1],
		this.m[2] - other.m[2]]);
}


Vector3.prototype.dot = function(other)
{
	return (
		this.m[0] * other.m[0] +
		this.m[1] * other.m[1] +
		this.m[2] * other.m[2]);
}


Vector3.prototype.cross = function(other)
{
	return new Vector3([
		this.m[1] * other.m[2] - this.m[2] * other.m[1],
		this.m[2] * other.m[0] - this.m[0] * other.m[2],
		this.m[0] * other.m[1] - this.m[1] * other.m[0]]);
}