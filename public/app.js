
var play = function(pjs) {

	var i = 0;

	var bkg = pjs.color(208,259,208);

	var numPoints = 10;
	var accel = .3;
	var opponentAccel = .15;

	var maxLinearVeloc = 5.0;
	var initialRand = 8;
	var initRadius = 80;
	var pointSpringConst = .001;

	var expandDirAmount = .07;
	var opponentRandMotion = .1;

	var affectAmount = .000005;
	var keyNow = false; //key pressed now

	var zero = new pjs.PVector(1,0);

	var lastPressed;
	var delta = 800;

	var f;

	var players = [];
	var currRendered = [];


	var started = false;

	var computePoints = true;

	var player;

	pjs.setup = function(){
		pjs.size(pjs.screenWidth,pjs.screenHeight);
		pjs.smooth();
		pjs.noStroke();
		player = new pjs.Blob(0,0,initRadius,pjs.color(59,134,134),0);
		player.expand(.5);
		f = pjs.createFont("Helvetica",80);

		lastPressed = Date.now();

		players = [];
		currRendered = []

		for(var i=0; i<1100; i++){
			var newBlob = new pjs.Blob(pjs.random(-10*pjs.width,10*pjs.width),
				pjs.random(-10*pjs.height,10*pjs.height),
				pjs.random(30,150), 
				pjs.color(pjs.random(100,220),pjs.random(100,220),pjs.random(100,220)),i);
			if(pjs.PVector.dist(player.pos,newBlob.pos) > pjs.width/3)
				players.push(newBlob);
		}


	}

	pjs.draw = function(){

		pjs.pushMatrix();
		pjs.translate(pjs.width/2-player.pos.x,pjs.height/2-player.pos.y)

		pjs.background(bkg);

		currRendered = [];

		for(var i=0; i<players.length; i++){

			players[i].autoRender();
		}

		player.render();

		pjs.popMatrix();

		if(!started){
			pjs.displayTitle();
		}

	};

	pjs.keyPressed = function(){

		var tNow = Date.now();

		if(tNow - lastPressed >= delta + player.rad*2){

			lastPressed = tNow;

			computePoints = true;
			var key = pjs.keyCode;

			keyNow = true;

			// left
			if(key == 37){
				player.a.x -= accel;
				player.expandDir(expandDirAmount,new pjs.PVector(1,0),Math.PI);
			}
			if(key == 40){ // down
				player.a.y += accel;
				player.expandDir(expandDirAmount,new pjs.PVector(0,-1),Math.PI/2);
			}
			if(key == 39){ // right
				player.a.x += accel;
				player.expandDir(expandDirAmount,new pjs.PVector(-1,0),0);
			}
			if(key == 38){ // up
				player.a.y -= accel;
				player.expandDir(expandDirAmount,new pjs.PVector(0,1),Math.PI*3/2);
			}

			//if(key == 32){ //spacebar
			//	player.expandRandom(.3,.1);
				player.affect(affectAmount + affectAmount*10/player.rad);
			//}
		}


	};

	pjs.keyReleased = function(){
		keyNow = false;
		for(var i=0; i<player.points.length; i++){
				var curr = player.points[i];
				curr.a = new pjs.PVector();
		}

	};

	pjs.mousePressed = function(){
		if(!started){
			started = true;
		}
	};

	pjs.updatePlayer = function(){

		var mouse = new pjs.PVector(pjs.mouseX,pjs.mouseY);
		var diff = pjs.PVector.sub(mouse, player.pos);
		diff.normalize();
		var angle = -1*pjs.atan(diff.y/diff.x);

		pjs.line(player.pos.x,player.pos.y,player.pos.x+diff.x*10,
			player.pos.y + diff.y * 10);

		var diff2 = new pjs.PVector(diff.x*accel,diff.y*accel);
		diff.mult(-1);
		player.a.add(diff2);
		player.expandDir(expandDirAmount,diff,angle);

	};
	

	pjs.displayTitle = function(){

		pjs.fill(100,172);
		pjs.textFont(f,pjs.width/7);
		pjs.textAlign(pjs.CENTER);
		pjs.text("DON'T",pjs.width/2,pjs.height/4);
		pjs.text("PANIC,",pjs.width/2,pjs.height/2);
		pjs.textFont(f,pjs.width/12);
		pjs.text("you're alive.",pjs.width/2,pjs.height*3/4);
		pjs.textFont(f,pjs.width/40);
		pjs.text("(click to start - use the arrow keys)",pjs.width/2,pjs.height-60);
	};

	pjs.Blob = function(x,y,rad,col,index){
		this.breath = true;
		//true = out, false = in
		this.breathDir = true;
		this.pos = new pjs.PVector(x,y);
		//points around edge
		this.points = [];
		var angle = 0;
		this.index = index;
		this.lastBreath = Date.now();

		for(var i=0; i<numPoints; i++){
			angle += 2*Math.PI/numPoints;
			var aX = rad*Math.cos(angle) + pjs.random(-1*initialRand,initialRand);
			var aY = rad*Math.sin(angle) + pjs.random(-1*initialRand,initialRand);
			var vX = Math.cos(angle);
			var vY = Math.sin(angle);
			this.points.push(new pjs.BlobPoint(aX,aY,vX,vY,angle,this));
		}

		this.v = new pjs.PVector(0,0);
		this.a = new pjs.PVector(0,0);
		this.rad = rad;
		this.c = col;
		this.nucleus = new pjs.PVector(pjs.random(rad/6,rad/4),
			pjs.random(rad/6,rad/4));



		this.render = function(){


			//collision detection
			/*for(var i=0; i<currRendered.length; i++){
				var curr = currRendered[i];
				var dist = pjs.PVector.dist(curr.pos,this.pos);
				if(dist < this.rad + curr.rad + 50){
					for(var x=0; x<this.points.length; x++){
						var currPoint = this.points[x];
						var dist = pjs.PVector.dist(currPoint.pos,curr.pos);
						if(dist < this.rad + curr.rad + 50){
							var diff = pjs.PVector.sub(currPoint.pos,curr.pos);
							diff.normalize();
							diff.mult(accel);
							currPoint.a.add(diff);
						}
					}
				}
			}*/

			this.a.mult(.95);
			this.v.mult(.95);


			if(this.v.x > maxLinearVeloc){
				this.v.x = maxLinearVeloc;
			}else if(this.v.x < -1*maxLinearVeloc){
				this.v.x = -1*maxLinearVeloc;
			}
			if(this.v.y > maxLinearVeloc){
				this.v.y = maxLinearVeloc;
			}else if(this.v.y < -1*maxLinearVeloc){
				this.v.y = -1*maxLinearVeloc;
			}	


			this.v.add(this.a);
			this.pos.add(this.v);

			pjs.fill(this.c,172);
			pjs.stroke(this.c,172);
			pjs.strokeWeight(12);
			pjs.beginShape();

			for(var i=0; i<this.points.length; i++){
				var curr = this.points[i];
				curr.render();

			}

			for(var i=0; i<3; i++){
				var curr = this.points[i];
				pjs.curveVertex(this.pos.x + curr.pos.x,this.pos.y + curr.pos.y);
			}

			

			pjs.endShape();

			pjs.strokeWeight(8);
			pjs.fill(this.c,100);
			pjs.ellipse(this.pos.x,this.pos.y,this.rad/2 + this.nucleus.x,
				this.rad/2 + this.nucleus.y);
				
		};

		this.autoRender = function(){

			if(pjs.abs(player.pos.x - this.pos.x) > pjs.width + this.rad * 1.5
				|| pjs.abs(player.pos.y - this.pos.y) > pjs.height + this.rad * 1.5){
				return;
			}

			currRendered.push(this);

			//actions occur at regular intervals, during "breath"
			if(this.breath){
				this.act();
				this.breath = false;
				this.lastBreath = Date.now();
			}

			if(Date.now() - this.lastBreath >= delta + this.rad*2){
				this.breath = true;
			}

			this.render();
		}


		//placeholder for future opponent behavior
		this.act = function(){

			var cell;
			var min = 1e9;
			//find nearest cell
			for(var i=0; i<currRendered.length; i++){
				var curr = currRendered[i];
				if(curr != this){
					var dist = pjs.PVector.dist(this.pos,curr.pos);
					if(dist < min){
						min = dist;
						cell = curr;
					}
				}
			}

			//compare to player
			var dist = pjs.PVector.dist(this.pos,player.pos);
			if(dist < min){
				min = dist;
				cell = player;
			}

			var diff = pjs.PVector.sub(this.pos,cell.pos);
			diff.normalize();
			diff.add(new pjs.PVector(pjs.random(-1*opponentRandMotion,opponentRandMotion),
				pjs.random(-1*opponentRandMotion,opponentRandMotion)));
			diff.mult(opponentAccel);
			var newA = new pjs.PVector(diff.x*-1,diff.y*-1);


			//if greater, run away
			if(cell.rad >= this.rad){
				this.a.add(diff);
				this.expandDir(expandDirAmount,diff,0);
			}else{ //else, attack
				this.a.add(newA);
				this.expandDir(expandDirAmount,newA,0);
				this.affectOther(affectAmount,cell);
			}


		};

		//expand with certain accel
		this.expand = function(accel){
			
			for(var i=0; i<this.points.length; i++){
				var curr = this.points[i];
				curr.a = new pjs.PVector(curr.dirV.x*accel,curr.dirV.y*accel);

			}			
		};

		this.expandRandom = function(accel, rand){
			
			for(var i=0; i<this.points.length; i++){
				var curr = this.points[i];
				curr.a = new pjs.PVector(curr.dirV.x*accel+pjs.random(-1*rand,rand),
					curr.dirV.y*accel + pjs.random(-1*rand,rand));

			}			
		};

		this.expandDir = function(accel,dir,angle2){

			var angle = -1*pjs.atan(dir.y/dir.x);

			//console.log(dir.x + ", " + dir.y);
			
			for(var i=0; i<this.points.length; i++){
				var curr = this.points[i];
				var currWeight = Math.abs((curr.angle + Math.PI - angle) 
					% Math.PI*2 - Math.PI);
				//console.log(angle + ": " + curr.angle + ", " + currWeight);
				currWeight *= 2.0;
				curr.a = new pjs.PVector((dir.x/2 + curr.dirV.x)*currWeight*accel,
					(dir.y/2 + curr.dirV.y)*currWeight*accel);

			}	
		};

		this.affect = function(accel){

			for(var i=0; i<currRendered.length; i++){
				var curr = currRendered[i];
				var a = pjs.PVector.sub(this.pos,curr.pos);
				var dist = a.mag();

				if(curr.rad < this.rad){
					if(dist < this.rad){
						this.eat(curr);
					}

					dist /= pjs.width;
					a.normalize;
					a.mult(accel/(Math.pow(dist,2)));
					curr.a.add(a);
				}

				

			}

		};

		this.affectOther = function(accel,other){

			var a = pjs.PVector.sub(this.pos,other.pos);
			var dist = a.mag();

			if(dist < this.rad && other.rad < this.rad){
				this.eat(other);
			}

			dist /= pjs.width;
			a.normalize;
			a.mult(accel/(Math.pow(dist,2)));
			other.a.add(a);

			a.mult(3);

			for(var i=0; i<other.points.length; i++){
				var currPoint = other.points[i];
				currPoint.a.add(a);
			}


		};

		this.eat = function(blob){

			if(blob == player){
				started = false;
				pjs.setup();
				return;
			}

			players.splice(blob.index,1);

			for(var i=0; i<players.length; i++){
				players[i].index = i;
			}

			var angle = 0;

			this.rad += blob.rad/10;

			for(var i=0; i<this.points.length; i++){
				var curr = this.points[i];
				angle += 2*Math.PI/this.points.length;
				var div = 15;
				var aX = this.rad*Math.cos(angle) + pjs.random(-1*this.rad/div,this.rad/div);
				var aY = this.rad*Math.sin(angle) + pjs.random(-1*this.rad/div,this.rad/div);
				curr.orig = new pjs.PVector(aX,aY);
				curr.pConst += pointSpringConst;
			}

		}

	};

	pjs.BlobPoint = function(x,y,vx,vy,angle,blob){
		//difference from blob pos
		this.pos = new pjs.PVector(x,y);
		this.orig = new pjs.PVector(x,y);
		this.blob = blob;
		this.dirV = new pjs.PVector(vx,vy);
		this.v = new pjs.PVector(0,0);
		this.a = new pjs.PVector(0,0);
		this.angle = angle;
		this.pConst = pointSpringConst;

		this.render = function(){

				var fromOrig = pjs.PVector.sub(this.pos,this.orig);
				fromOrig.mult(-1*pointSpringConst)
				
				this.a.add(fromOrig);

				this.v.add(this.a);
				this.pos.add(this.v);

				this.a.mult(.85);
				this.v.mult(.85);


				pjs.curveVertex(blob.pos.x + this.pos.x,blob.pos.y + this.pos.y)
				var cx = blob.pos.x + this.pos.x;
				var cy = blob.pos.y + this.pos.y;
				pjs.strokeWeight(2);
				pjs.line(cx,cy,cx+this.dirV.x*20,cy+this.dirV.y*20);
				pjs.strokeWeight(15);
		}

	};

};

var canvas = document.getElementById("bioCanvas");
var processingInstance = new Processing(canvas, play);
processingInstance.externals.sketch.options.pauseOnBlur = true;
processingInstance.externals.sketch.options.globalKeyEvents = true;

