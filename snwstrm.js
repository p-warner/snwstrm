window.onload = function(){

	//canvas init
	var canvas = document.createElement('canvas');
	var b = document.getElementsByTagName("body")[0];
	b.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	
	//canvas dimensions
	var W = window.innerWidth;
	var H = window.innerHeight;
	canvas.width = W;
	canvas.height = H;
	canvas.style.zIndex = -1;
	canvas.style.position = 'fixed';
	canvas.style.top = 0;
	canvas.style.right = 0;
	canvas.style.bottom = 0;
	canvas.style.left = 0;
	
	//snowflake particles
	var mp = 50; //max particles
	var accumulationResolution = mp * 4; //max particles
	var particles = [];
	var accumulation = []; //accumulation on the bottom
	var accumulationPointer = 0;
	for(var i = 0; i < mp; i++){
		particles.push({
			x: Math.random()*W, //x-coordinate
			y: Math.random()*H, //y-coordinate
			r: Math.random()*4+1, //radius
			d: Math.random()*mp //density
		})
	}
	for(var i = 0; i < accumulationResolution; i++){
		accumulation.push({
			x: Math.random()*W, //x-coordinate
			y: H, //y-coordinate
			r: Math.random()*4+1, //radius
			d: Math.random()*mp //density
		})
	}
	
	//Lets draw the flakes
	function draw()	{
		ctx.clearRect(0, 0, W, H);
		
		ctx.fillStyle = "rgba(200, 200, 200, 0.8)";
		ctx.beginPath();
		for(var i = 0; i < mp; i++){
			var p = particles[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
		}

		for(var i = 0; i < accumulationResolution; i++){
			var p = accumulation[i];
			ctx.moveTo(p.x, p.y);
			ctx.arc(p.x, (p.y-p.r), p.r, 0, Math.PI*2, true);
		}

		ctx.fill();

		update();
	}
	
	//Function to move the snowflakes
	//angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
	var angle = 0;
	function update(){
		angle += 0.01;
		for(var i = 0; i < mp; i++){
			var p = particles[i];
			//Updating X and Y coordinates
			//We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
			//Every particle has its own density which can be used to make the downward movement different for each flake
			//Lets make it more random by adding in the radius
			p.y += Math.cos(angle+p.d) + 1 + p.r/2;
			p.x += Math.sin(angle) * 2;
			
			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			/**/
			if(p.x > W+5 || p.x < -5 || p.y > H){
				if(i%3 > 0){ //66.67% of the flakes
					particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
				}else{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0){
						//Enter from the left
						particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
					}else{
						//Enter from the right
						particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
					}
				}
				//collided with bottom
				if( p.y > H ){
					accumulation[accumulationPointer] = {
						x: p.x,
						y: p.y, 
						r: p.r, 
						d: p.d 
					};
					accumulationPointer++;
					accumulationPointer %= accumulationResolution;
				}
			}
			
			

		}
		requestAnimationFrame(draw);
	}
	
	//animation loop
	requestAnimationFrame(draw);
}