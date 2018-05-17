var TICKS_PER_SECOND = 1;

function Robot(type, c, co, s)
{
	this.robottype = type;
	this.count = c;
	this.cost = co;
	this.scrap = s;

	this.clicks = new Decimal(0);
}

window.addEventListener('load', function() {
    var elements = {
        txtScrap: document.querySelector("#res-scrap"),
        txtRobotsTypeE: document.querySelector("#rob-e"),
        btnRobotsTypeE: document.querySelector("#build-rob-e"),
        txtRobotsTypeZ: document.querySelectorAll("#rob-z"),
        btnRobotsTypeZ: document.querySelector("#build-rob-z")
    };
    
    var numScrap = new Decimal(0);
    
    var robotsTypeE = new Robot("E", new Decimal(0), new Decimal(10), new Decimal(1));
    var robotsTypeZ = new Robot("Z", new Decimal(0), new Decimal(250), new Decimal(10));
    
    document.querySelector("#gather-scrap").addEventListener('click', function(evt) {
        numScrap = numScrap.plus(1);
        updateScrapText();
    });
    
    document.querySelector("#build-rob-e").addEventListener('click', function(evt) {
        console.log(evt.target);
        if (numScrap < robotsTypeE.cost) return;
        
        robotsTypeE.count = robotsTypeE.count.plus(1);
        numScrap = numScrap.minus(robotsTypeE.cost);

        robotsTypeE.cost = robotsTypeE.times(1.25).ceil();
        updateTypeEText();
        updateScrapText();
    });
    
    document.querySelector("#build-rob-z").addEventListener('click', function(evt) {
        console.log(evt.target);
        if (numScrap < robotsTypeZ.cost) return;
        
        robotsTypeZ.count = robotsTypeZ.cost.plus(1);
        numScrap = numScrap.minus(robotsTypeZ.cost);
        robotsTypeZ.cost = robotsTypeZ.times(1.25).ceil();
        updateTypeZText();
        updateScrapText();
    });

    document.querySelector("#add-rob-z").addEventListener('click', function(evt) {
    	if (robotsTypeZ.count.isZero())
    		robotsTypeZ.count = robotsTypeZ.count.plus(1);
    	else 
    		robotsTypeZ.count = robotsTypeZ.count.times(2);
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
        var x = robotsTypeE.count.times( robotsTypeE.scrap ).dividedBy( TICKS_PER_SECOND );
        x = x.plus(robotsTypeZ.count.times( robotsTypeZ.scrap ).dividedBy( TICKS_PER_SECOND ));
        numScrap = numScrap.plus(x);

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
    //return x;
}