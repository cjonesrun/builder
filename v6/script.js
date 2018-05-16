var TICKS_PER_SECOND = 1;

function Robot(type, c, co, s)
{
	this.robottype = type;
	this.count = c;
	this.cost = co;
	this.scrap = s;

	this.clicks = 0;
}


window.addEventListener('load', function(global) {

	console.log("global", global);
    var elements = {
        txtScrap: document.querySelector("#res-scrap"),
        txtRobotsTypeE: document.querySelector("#rob-e"),
        btnRobotsTypeE: document.querySelector("#build-rob-e"),
        txtRobotsTypeZ: document.querySelectorAll("#rob-z"),
        btnRobotsTypeZ: document.querySelector("#build-rob-z")
    };
    
    var numScrap = 0;
    
    var robotsTypeE = new Robot("E", 0, 10, 1);
    var robotsTypeZ = new Robot("Z", 0, 250, 10);
    
    document.querySelector("#gather-scrap").addEventListener('click', function(evt) {
        numScrap++;
        updateScrapText();
    });
    
    document.querySelector("#build-rob-e").addEventListener('click', function(evt) {
        if (numScrap < robotsTypeE.cost) return;
        
        robotsTypeE.count += 1;
        numScrap -= robotsTypeE.cost;
        robotsTypeE.cost = Math.ceil(robotsTypeE.cost * 1.25);
        updateTypeEText();
        updateScrapText();
    });
    
    document.querySelector("#build-rob-z").addEventListener('click', function(evt) {
        if (numScrap < robotsTypeZ.cost) return;
        
        robotsTypeZ.count += 1;
        numScrap -= robotsTypeZ.cost;
        robotsTypeZ.cost = Math.ceil(robotsTypeZ.cost * 1.25);
        updateTypeZText();
        updateScrapText();
    });

    document.querySelector("#add-rob-z").addEventListener('click', function(evt) {
    	if (robotsTypeZ.count === 0)
    		robotsTypeZ.count += 1;
    	else 
    		robotsTypeZ.count *= 2;
        //numScrap -= robotsTypeZ.cost;
        //robotsTypeZ.cost = Math.ceil(robotsTypeZ.cost * 1.25);
        updateTypeZText();
        updateScrapText();
    });
    
    function updateScrapText() {
        elements.txtScrap.innerHTML = nf(numScrap);
    }
    
    function updateTypeEText() {
        elements.txtRobotsTypeE.innerHTML = nf(robotsTypeE.count);
        elements.btnRobotsTypeE.innerHTML = "Build (" + nf(robotsTypeE.cost) + ")";
    }
    
    function updateTypeZText() {

    	for (var x=0; x<elements.txtRobotsTypeZ.length; x++)
    	{
    		elements.txtRobotsTypeZ[x].innerHTML = nf(robotsTypeZ.count);
    	}
       
        elements.btnRobotsTypeZ.innerHTML = "Build (" + nf(robotsTypeZ.cost) + ")";
    }
    
    function gameLoop() {
        //numScrap += Math.ceil(robotsTypeE.count * robotsTypeE.scrap);
        //numScrap += Math.ceil(robotsTypeZ.count * robotsTypeZ.scrap);

        var x = robotsTypeE.count * robotsTypeE.scrap / TICKS_PER_SECOND;
        x += robotsTypeZ.count * robotsTypeZ.scrap / TICKS_PER_SECOND;
        numScrap += x;

        updateScrapText();
        window.setTimeout(gameLoop, 1000 / TICKS_PER_SECOND);
    }
    
    gameLoop();

});




var NUMBERFORMAT = {
	format: 'standard',  // ['standard', 'hybrid', 'longScale']
	flavor: 'short', // ['full', 'short']
	sigfigs: 3
}

var formatter = new  numberformat.Formatter({ sigfigs: NUMBERFORMAT.sigfigs, 
	backend: 'decimal.js', format: NUMBERFORMAT.format, flavor: NUMBERFORMAT.flavor });

function nf(x) {
	return formatter.format(x);
}