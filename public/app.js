
var play = function(pjs) {

    var i = 0;

    var bkg = pjs.color(205, 205, 205);

  var players = []

    var player;

    var one = pjs.random(255);
    var two = pjs.random(255);
    var three = pjs.random(255);

    var x;
    var y;

    var started = false;


    pjs.setup = function(){
	pjs.size(pjs.screenWidth,pjs.screenHeight);
	pjs.smooth();
	pjs.noStroke();
	pjs.frameRate(60);
	f = pjs.createFont("Helvetica",80);

	lastPressed = Date.now();

    }

    pjs.draw = function(){
    if (!started) {
	   pjs.background(bkg);
	}
	pjs.fill(255, 120, 100);
	pjs.ellipse(30, pjs.height*19/20, 300, 300); //bottom left - orange
	pjs.fill(100, 200, 250);
	pjs.ellipse(pjs.width-30, pjs.height*19/20, 300, 300); //bottom right - blue
	pjs.fill(160, 255, 180);
	pjs.ellipse(30, 30, 300, 300); //top left - green
	pjs.fill(135, 100, 130);
	pjs.ellipse(pjs.width-30, 40, 300, 300); //top right - purple
	pjs.fill(250, 250, 250);
	pjs.ellipse(pjs.width/2, pjs.height+20, 250, 200);
	if(!started){
	    pjs.displayTitle();
	}

    };

    pjs.keyPressed = function() {
	started = false;
	pjs.setup();
    };


    pjs.mousePressed = function(){
	if(!started){
	    started = true;
	    pjs.background(bkg);
	} else {
	    x = pjs.mouseX;
	    y = pjs.mouseY;

	    if (x<150 && y>((pjs.height*19/20)-130)) {
		one = 255;
		two = 120;
		three = 100;
	    } else if (x>pjs.width-150 && y>((pjs.height*19/20)-140)) {
		one = 100;
		two = 200;
		three = 250;
	    } else if (x<180 && y<180) {
		one = 160;
		two = 255;
		three = 180;
	    } else if (x>pjs.width-140 && y<180) {
		one = 135;
		two = 100;
		three = 130;
	    } else if ((x<(pjs.width/2)+120) && (((pjs.width/2)-120)<x) && (y > pjs.height-70)) {
		one = pjs.random(255);
		two = pjs.random(255);
		three = pjs.random(255);
	    }


	    pjs.fill(one, two, three);
	    pjs.ellipse(pjs.mouseX, pjs.mouseY, 20, 20)
	}
    };

    pjs.mouseDragged = function() {
	if (!started) {
	    started = true;
	} else {

	    if ((x<(pjs.width/2)+120) && (((pjs.width/2)-120)<x) && (y > pjs.height-70)) {
		one = pjs.random(255);
		two = pjs.random(255);
		three = pjs.random(255);
	    }
	    pjs.fill(one, two, three);
	    pjs.ellipse(pjs.mouseX, pjs.mouseY, 20, 20)
	}
    }




    pjs.displayTitle = function(){

	pjs.fill(100,172);
	pjs.textFont(f,pjs.width/7);
	pjs.textAlign(pjs.CENTER);
	pjs.text("WELCOME",pjs.width/2,pjs.height/4);
	pjs.text("TO THIS",pjs.width/2,pjs.height/2);
	pjs.textFont(f,pjs.width/12);
	pjs.text("drawing board.",pjs.width/2,pjs.height-200);
	pjs.textFont(f,pjs.width/40);
	pjs.text("click to start - click on one of the colors,",pjs.width/2,pjs.height-120);
	pjs.text("or on white for a random color.",pjs.width/2,pjs.height-90);
	pjs.text("you can drag your mouse! (try it from the white circle)",pjs.width/2,pjs.height-60);
	pjs.text("press any key to start over.",pjs.width/2,pjs.height-30);
    };
  
};

var canvas = document.getElementById("bioCanvas");
var processingInstance = new Processing(canvas, play);
processingInstance.externals.sketch.options.pauseOnBlur = true;
processingInstance.externals.sketch.options.globalKeyEvents = true;
