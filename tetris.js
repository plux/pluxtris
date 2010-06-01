
if(window.addEventListener) {
    window.addEventListener('load', function () {

	    var colors = ["#FFFFFF",   // 0
			  "#000000",   // 1
			  "#00FFFF",   // 2
			  "#FF00FF",   // 3
			  "#0000FF",   // 4
			  "#FFAA00",   // 5
			  "#FF0000",   // 6
			  "#00FF00",   // 7
			  "#FFFF00"];  // 8

	    var i_block = [[0,0,0,0],
			   [0,0,0,0],
			   [2,2,2,2],
			   [0,0,0,0]];


	    var t_block = [[0,0,0,0],
			   [0,0,3,0],
			   [0,3,3,0],
			   [0,0,3,0]];

	    var l_block = [[0,0,0,0],
			   [0,0,4,0],
			   [4,4,4,0],
			   [0,0,0,0]];



	    var l2_block = [[0,0,0,0],
			    [5,5,5,0],
			    [0,0,5,0],
			    [0,0,0,0]];


	    var s_block = [[0,0,0,0],
			    [0,6,6,0],
			    [6,6,0,0],
			    [0,0,0,0]];

	    var s2_block = [[0,0,0,0],
			    [7,7,0,0],
			    [0,7,7,0],
			    [0,0,0,0]];
	    
	    var o_block = [[0,0,0,0],
			   [0,8,8,0],
			   [0,8,8,0],
			   [0,0,0,0]];
	    
		
	    var shapes = [i_block,
			  t_block,
			  l_block,
			  l2_block,
			  s_block,
			  s2_block,
			  o_block];


	    var ROWS = 21;
	    var COLS = 12;
	    var BLOCKSIZE = 15;
	    var blocks = new Array(ROWS);
	    var block_x = COLS / 2;
	    var block_y = 0;
	    var shape = shapes[0];

	    function init() {
		// Create field
		for (y=0; y<ROWS; y++) {
		    blocks[y] = new Array(COLS);
		    for (x=0; x<COLS; x++) {
			blocks[y][x] = 0;
		    }
		}
		
		// Bottom border
		for (x=0; x<COLS; x++) {
		    blocks[ROWS-1][x] = 1;
		}
		
		// Side borders
		for (y=0; y<ROWS; y++) {
		    blocks[y][0] = 1;
		    blocks[y][COLS-1] = 1;
		}
	    }
		

				    
	var canvas, context, canvaso, contexto;  
	// Find the canvas element.
	canvaso = document.getElementById('canvas');
	if (!canvaso) {
	    alert('Error: I cannot find the canvas element!');
	    return;
	}

	if (!canvaso.getContext) {
	    alert('Error: no canvas.getContext!');
	    return;
	}  

	// Get the 2D canvas context.
	contexto = canvaso.getContext('2d');
	if (!contexto) {
	    alert('Error: failed to getContext!');
	    return;
	}
	
	// Add the temporary canvas.
	var container = canvaso.parentNode;
	canvas = document.createElement('canvas');
	if (!canvas) {
	    alert('Error: I cannot create a new canvas element!');
	    return;
	}
		
	canvas.id     = 'tetris';
	canvas.width  = canvaso.width;
	canvas.height = canvaso.height;
	container.appendChild(canvas);
	context = canvas.getContext('2d');	

	context.shadowOffsetX = 5;
	context.shadowOffsetY = 5;
	context.shadowBlur    = 4;
	context.shadowColor   = 'rgba(0, 0, 0, 0.3)';

	rightDown = false;
	leftDown = false;
	upDown = false;
	downDown = false;
	spaceDown = false;

	function keydown(evt) {	    
	    if (evt.keyCode == 39) rightDown = true;
	    else if (evt.keyCode == 37) leftDown = true;
	    else if (evt.keyCode == 32) spaceDown = true;
	    else if (evt.keyCode == 38) upDown = true;	 
	    else if (evt.keyCode == 40) downDown = true;
	}
	

	function keypress(evt) {
	}
	
	function keyup(evt) {	    
	    if (evt.keyCode == 39) rightDown = false;
	    else if (evt.keyCode == 37) leftDown = false;
	    else if (evt.keyCode == 32) spaceDown = false;
	    else if (evt.keyCode == 38) upDown = false;
	    else if (evt.keyCode == 40) downDown = false;
	 
	}

	function rotate() {
	    new_shape = [[0,0,0,0],
			 [0,0,0,0],
			 [0,0,0,0],
			 [0,0,0,0]];
	    for (i=0; i<4; i++) {
		for (j=0; j<4; j++) {
		    new_shape[j][1-(i-2)] = shape[i][j];
		}
	    }		
	    old_shape = shape;	    
	    shape = new_shape;
	    if (is_colliding()) {
		shape = old_shape;
	    }
	}


	function draw() {
	    function clear() {
		context.clearRect(0, 0, BLOCKSIZE*COLS+BLOCKSIZE+(10*BLOCKSIZE), BLOCKSIZE*ROWS+BLOCKSIZE);
	    }

	    function rect(x,y,w,h) {
		context.beginPath();
		context.rect(x,y,w,h);
		context.closePath();
		context.fill();
	    }
	    function draw_block(x, y, color) {
	    
		context.fillStyle = color;
		context.fillRect(BLOCKSIZE*x,
				 BLOCKSIZE*y,
				 BLOCKSIZE,
				 BLOCKSIZE);
		context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
		context.strokeRect(BLOCKSIZE*x,
				 BLOCKSIZE*y,
				 BLOCKSIZE,
				 BLOCKSIZE);				

	    }
	    function draw_shape(x, y, s) {
		for (i=0; i<4; i++) {
 		    for (j=0; j<4; j++) {
			if (s[i][j] != 0) {
			    draw_block(x+i, y+j, colors[s[i][j]]);
			}
		    }
		}		       
	    }
	    clear();

	    for(y=0; y<ROWS; y++) {
		for (x=0; x<COLS; x++) {
		    var color = blocks[y][x];
		    if (blocks[y][x] != 0) {
			draw_block(x, y, colors[color]);
		    }
		}
	    }
	    draw_shape(block_x, block_y, shape);
	    draw_shape(COLS+1, 2, next_shape);
	    context.fillStyle = '#000000';
	    context.font         = 'italic 30px sans-serif';
	    context.textBaseline = 'top';
	    context.fillText = ('Next piece:', 0, 0);

	}
	
	function is_colliding() {
	    for (i=0; i<4; i++) {
		for (j=0; j<4; j++) {
		    if (shape[i][j] != 0 && 
			blocks[block_y+j][block_x+i] != 0) {
			return true;
		    }
		}
	    }
	    return false;
	}


	function update_input() {
	    if (rightDown) {
		block_x++;
		if (is_colliding()) {
		    block_x--;
		}
	    }
	    else if (leftDown) {
		block_x--;
		if (is_colliding()) {
		    block_x++;
		}
	    }
	    else if (upDown) {
		rotate();
		upDown = false;
	    }
	    else if (downDown) {
		move_down();
	    }
	    else if (spaceDown) {
		/* check for collision */
		while (!is_colliding()) {
		    block_y++;
		}
		block_y--;
		put_block();
		get_new_block();
		spaceDown = false;
	    }

	}
	function get_random_shape() {
	    return shapes[Math.floor(Math.random()*shapes.length)];
	}

	function get_new_block() {	    
	    block_x = (COLS / 2) - 2;
	    block_y = 0;	
	    shape = next_shape;
	    next_shape = get_random_shape();
	    if (is_colliding()) { // Game over
		init();
	    }
	}
	

	function put_block() {
	    for (i=0; i<4; i++) {
		for (j=0; j<4; j++) {
		    if (shape[i][j] != 0) 
			blocks[block_y+j][block_x+i] = shape[i][j];
		}
	    }
	}

	function move_down() {
	    block_y++;
	    if (is_colliding()) {
		block_y--;
		put_block();
		get_new_block();
	    }
	    
	}

	function get_empty_line() {
	    line = new Array(COLS);	  

	    // Borders
	    line[0] = 1;
	    line[COLS-1] = 1;

	    // Rest is empty
	    for(i=1; i<COLS-1; i++) {
		line[i] = 0;
	    }
	    return line;
	}

	function remove_full_lines() {
	    for (y=0; y<(ROWS-1); y++) {
		is_full = true;
		for (x=1; x <(COLS-1); x++) {
		    if (blocks[y][x] == 0) {
			is_full = false;
			break;
		    }
		}
		if (is_full) {
		    blocks.splice(y,1);
		    blocks.unshift(get_empty_line());
			
		}
	    }
	}

	var ticks = 0;
	function update() {
	    update_input();
	    ticks++;
	    if (ticks == 10) {
		ticks = 0;
		move_down();
	    }	
	    remove_full_lines();
	    draw();
	}
	

	//clear();
	setInterval(update, 50);       
	init();
	next_shape = get_random_shape();
	get_new_block();

	
	if (document.addEventListener) {
	    document.addEventListener("keydown",keydown,false);
	    document.addEventListener("keypress",keypress,false);
	    document.addEventListener("keyup",keyup,false);
	} else if (document.attachEvent) {
	    document.attachEvent("onkeydown", keydown);
	    document.attachEvent("onkeypress", keypress);
	    document.attachEvent("onkeyup", keyup);
	} else {
	    document.onkeydown= keydown;
	    document.onkeypress= keypress;
	    document.onkeyup= keyup;
	}       
    }, false);
}
