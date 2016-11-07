function RenderModeWireframe()
{
	this.screen = [];
	for (var j = 0; j < screenHeight; j++)
	{
		this.screen[j] = [];
		for (var i = 0; i < screenWidth; i++)
		{
			this.screen[j][i] = 0;
		}
	}
}


RenderModeWireframe.prototype.render = function(projection)
{
	var geometry = scene.getGeometry();
	
	for (var j = 0; j < screenHeight; j++)
		for (var i = 0; i < screenWidth; i++)
			this.screen[j][i] = 0;
		
	for (var m = 0; m < geometry.models.length; m++)
	{
		var model = geometry.models[m];
		var matrix = projection.mulMatrix(model.matrix);
		
		for (var t = 0; t < model.trianglefans.length; t++)
		{
			var trianglefan = model.trianglefans[t];
			
			for (var v = 0; v < trianglefan.length; v++)
			{
				this.transformLine(
					trianglefan[v],
					trianglefan[(v + 1) % trianglefan.length],
					matrix);
			}
		}
	}
	
	this.presentScreen();
}


RenderModeWireframe.prototype.transformLine = function(a, b, matrix)
{
	var ma = matrix.mulVector(a);
	var mb = matrix.mulVector(b);

	// Perspective divide.
	var x1 = ma[0] / ma[3];
	var y1 = ma[1] / ma[3];
	var x2 = mb[0] / mb[3];
	var y2 = mb[1] / mb[3];

	// Viewport transformation.
    x1 = x1 * screenWidth  / 2 + screenWidth  / 2;
    y1 = y1 * screenHeight / 2 + screenHeight / 2;
    x2 = x2 * screenWidth  / 2 + screenWidth  / 2;
    y2 = y2 * screenHeight / 2 + screenHeight / 2;

    this.renderLine(x1, y1, x2, y2);
}


RenderModeWireframe.prototype.renderLine = function(x1, y1, x2, y2)
{
    var w = x2 - x1;
    var h = y2 - y1;

	// TODO: Proper line clipping.
    var lineSize = w * w + h * h;
	if (lineSize > 100 * 100)
		return;

    var wadd = w / lineSize;
    var hadd = h / lineSize;

    var xlast = -100;
    var ylast = -100;
	
    var xlist = [];
    var ylist = [];

    var li = 0;
    for (var i = 0; i < lineSize; i++)
    {
        var x = Math.floor(x1 + wadd * i);
        var y = Math.floor(y1 + hadd * i);
		
		if (x < 0 || y < 0 || x >= screenWidth || y >= screenHeight)
			continue;
		
        if (x == xlast && y == ylast)
            continue;

        if (xlast != -100 && x != xlast && y != ylast)
        {
            xlist[li] = x;
            ylist[li] = y - (hadd < 0 ? -1 : (hadd > 0 ? 1 : 0));
            li++;
        }

        xlist[li] = x;
        ylist[li] = y;
        li++;

        xlast = x;
        ylast = y;
    }

    for (var i = 0; i < li; i++)
    {
        var box = 0;
        var RIGHT = 0x1;
        var LEFT = 0x2;
        var UP = 0x4;
        var DOWN = 0x8;

        if (i > 0)
        {
            if (xlist[i - 1] == xlist[i] - 1 && ylist[i - 1] == ylist[i]) box |= LEFT;
            if (xlist[i - 1] == xlist[i] + 1 && ylist[i - 1] == ylist[i]) box |= RIGHT;
            if (xlist[i - 1] == xlist[i] && ylist[i - 1] == ylist[i] - 1) box |= UP;
            if (xlist[i - 1] == xlist[i] && ylist[i - 1] == ylist[i] + 1) box |= DOWN;
        }
        if (i < li - 1)
        {
            if (xlist[i + 1] == xlist[i] - 1 && ylist[i + 1] == ylist[i]) box |= LEFT;
            if (xlist[i + 1] == xlist[i] + 1 && ylist[i + 1] == ylist[i]) box |= RIGHT;
            if (xlist[i + 1] == xlist[i] && ylist[i + 1] == ylist[i] - 1) box |= UP;
            if (xlist[i + 1] == xlist[i] && ylist[i + 1] == ylist[i] + 1) box |= DOWN;
        }

        this.putChar(xlist[i], ylist[i], box);
    }
}


RenderModeWireframe.prototype.putChar = function(x, y, c)
{
    if (x >= 0 && x < screenWidth && y >= 0 && y < screenHeight)
        this.screen[y][x] |= c;
}


RenderModeWireframe.prototype.presentScreen = function()
{
    var output = "";

    for (var j = 0; j < screenHeight; j++)
    {
        for (var i = 0; i < screenWidth; i++)
        {
            var box = this.screen[j][i];
            var RIGHT = 0x1;
            var LEFT = 0x2;
            var UP = 0x4;
            var DOWN = 0x8;

            var c;
            switch (box)
            {
                case RIGHT:// c = "╶"; break;
                case LEFT://  c = "╴"; break;
                case RIGHT | LEFT: c = "─"; break;

                case UP:// c = "╵"; break;
                case DOWN:// c = "╷"; break;
                case UP | DOWN: c = "│"; break;

                case UP | RIGHT: c = "└"; break;
                case UP | LEFT:  c = "┘"; break;
                case UP | RIGHT | LEFT: c = "┴"; break;

                case DOWN | RIGHT: c = "┌"; break;
                case DOWN | LEFT:  c = "┐"; break;
                case DOWN | RIGHT | LEFT: c = "┬"; break;

                case UP | DOWN | RIGHT: c = "├"; break;
                case UP | DOWN | LEFT:  c = "┤"; break;

                case UP | DOWN | RIGHT | LEFT: c = "┼"; break;

                case 0: c = " "; break;
            }

            output += c;
        }

        output += "\n";
    }

    var span = document.getElementById("divScreen");
	span.innerHTML = output;
}