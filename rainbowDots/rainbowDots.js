var APP = (function(){
  var module = {};
  var maxDots = 1000;
  var fps = 120;
  
  module.allDots = [];
  module.colorSchemes = {};
  module.inScheme = false;
  module.currentScheme = null;
  module.canvas = null;
  module.audioTag = null;
  module.americaMode = false;
  
  
  module.ColorScheme = function(id, name, colors){
    this.id = id;
	this.name = name;
	this.colors = colors;
	this.randomSchemeColor = function(){
	  var variationMax = 0;
      var randomColor = this.colors[Math.floor(Math.random()*this.colors.length)];
	  var randVar = Math.floor((Math.random()*2*variationMax))-variationMax;
	  var randRed = randomColor[0] + randVar;
	  if (randRed > 255){
	    randRed = 255;
	  }
	  else if(randRed < 0){
	    randRed = 0;
	  }
	 
	  randVar = Math.floor((Math.random()*2*variationMax))-variationMax;
	  randGreen = randomColor[1] + randVar;
	  if (randGreen  > 255){
	    randGreen  = 255;
	  }
	  else if(randGreen  < 0){
	    randGreen  = 0;
	  }
	  randVar = Math.floor((Math.random()*2*variationMax))-variationMax;
	  randBlue = randomColor[2] + randVar;
	  if (randBlue > 255){
	    randBlue = 255;
	  }
	  else if(randBlue < 0){
	    randBlue = 0;
	  }
	  return [randRed, randGreen, randBlue];
	}
  }
  
  module.newColorScheme = function(id, name, colors){
    var newScheme = new module.ColorScheme(id, name, colors);
	module.colorSchemes[id] = newScheme;
  }
  
  module.loadDefaultColorSchemes  = function(){
    module.newColorScheme(54697, "Halloween", [[19, 9, 18], [62, 28, 51],[96,39,73],[177,70,35],[246,146,29]]);
    module.newColorScheme(635620, "Christmas",[[4,142,39],[32,248,86],[255,255,255],[248,32,86],[197,5,56]]);
    module.newColorScheme(1645741, "America",  [[224, 0, 0],[249, 0, 52],[255, 255, 255],[55,0,170],[36,0,108]]);
    module.newColorScheme(769408, "Easter", [[221,229, 254],[255,203,207],[249,252,157],[186,243,195],[217,178,255]]);  
    module.newColorScheme(211236, "Skin Tones", [[82, 46, 26], [107,78,40],[211,174,136],[236,204,165],[250,227,198]]);
  };
  
 
  
 
  
  module.PhysicsDot =  function(canvas, x, y, velX, velY, accelX, accelY, radius, red, green, blue, alpha){
    this.x = x;
	this.y = y;
	this.velX = velX;
	this.velY = velY;
	this.accelX = accelX;
	this.accelY = accelY;
	this.radius = radius;
	this.radiusVel = 0;
    this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.red = red;
	this.green = green;
	this.blue = blue;
	this.alpha = alpha;
	this.fillColor=module.rgbaToString(this.red, this.green, this.blue, this.alpha);
	this.vel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
	this.drawDot = function(){
	  this.fillColor=module.rgbaToString(this.red, this.green, this.blue, this.alpha);
	  this.ctx.beginPath();
	  this.ctx.fillStyle = this.fillColor;
	  this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
	  this.ctx.fill();
	  //this.ctx.fillStyle = "black"
	  //this.ctx.fillText(this.vel.toFixed(2), this.x, this.y);
	  this.ctx.closePath();
	}; 
	this.destroyDot = function(){
	  module.allDots.splice(module.allDots.indexOf(this), 1);
	}

	this.updateDot = function(){
	  this.radius = this.radius + this.radiusVel;
	  if (this.radius < 2){
	    this.destroyDot();
	  }
	  this.velX = this.velX + (this.accelX/fps);
	  this.velY = this.velY + (this.accelY/fps);
	  this.x = (this.x+(this.velX/fps));
	  if (this.x + this.radius < 0){
	    this.x = this.canvas.width + this.radius;
	  }
	  else if (this.x-this.radius > this.canvas.width){
	    this.x = 0 - this.radius;
	  }
	  this.y = (this.y+(this.velY/fps));
	  if (this.y + this.radius < 0){
	    this.y = this.canvas.height + this.radius;
	  }
	  else if (this.y - this.radius >= this.canvas.height){
	    this.y = 0 - this.radius;
	  }
	  this.vel = Math.sqrt(Math.pow(this.velX, 2) + Math.pow(this.velY, 2));
	  this.drawDot();
	}
  };
	module.getMousePos =  function (canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: (evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width,
          y: (evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height
        };
    };
	
	module.rgbaToString = function(r, g, b, a){
	  return "rgba("+r+","+g+","+b+","+a+")";
	}
	
	module.newDot = function(x, y){
	  var velXMax = 50;
	  var velYMax = 50;
	  
	  var randVelX = (Math.random()*2*velXMax)-velXMax;
      var randVelY = (Math.random()*2*velYMax)-velYMax;
	  
	  var accelXMax = 2;
	  var accelYMax = 2;
	  
	  var randAccelX = 0;//(Math.random()*2*accelXMax)-accelXMax;
	  var randAccelY = 0;//(Math.random()*2*accelYMax)-accelYMax;
	  var randRed, randGreen, randBlue;
	  var randAlpha = Math.random();
	  var randRadius = 5 + Math.floor(Math.random()*45 +1);
      if (module.currentScheme == null){
	    randRed = Math.floor(Math.random()*255+1);
	    randGreen = Math.floor(Math.random()*255+1);
	    randBlue = Math.floor(Math.random()*255+1);
	  }
	  else{
	    var randColor = module.currentScheme.randomSchemeColor();
	    randRed = randColor[0];
		randGreen = randColor[1];
		randBlue = randColor[2];
	  
	  }
	  
	  var myDot = new module.PhysicsDot(module.canvas, x, y, randVelX, randVelY, randAccelX, randAccelY, randRadius, randRed, randGreen, randBlue, randAlpha);
      myDot.drawDot();
	  module.allDots.push(myDot);
	  if (module.allDots.length > maxDots){
	    module.allDots.shift();
	  }
    };
	
	module.updateDots = function(){
       ctx.clearRect(0, 0, module.canvas.width, module.canvas.height);
       for (var i = 0; i < module.allDots.length; i++){
         var currentDot = module.allDots[i];
	     currentDot.updateDot();
       }
    };
	
	module.redrawDots = function(){
	  ctx.clearRect(0, 0, module.canvas.width, module.canvas.height);
       for (var i = 0; i < module.allDots.length; i++){
         var currentDot = module.allDots[i];
	     currentDot.drawDot();
       }
	}
	
	
	module.newDotClickHandler = function(event){
	  if (Math.random() < 1){
        var mousePos = module.getMousePos(module.canvas, event);
        module.newDot(mousePos.x, mousePos.y);
	  }
    };
	
	module.dotsOn = function(){
	   module.canvas.addEventListener("mousemove", module.newDotClickHandler);
	}
	module.dotsOff = function(event){
	  module.canvas.removeEventListener("mousemove", module.newDotClickHandler);
	}
	
	
	module.clearDots = function(){
	 for (var i = 0; i < module.allDots.length; i++){
         var currentDot = module.allDots[i];
	     currentDot.radiusVel = -2;
       }
	}
	
	module.resizeHandler = function(event){
	  module.canvas.height = window.innerHeight;
	  module.canvas.width = window.innerWidth;
	  module.redrawDots();
	}
	
	module.makeColorSchemeRow = function(scheme){
	  var $newRow = jQuery("<div></div>").addClass("colorRow").data("id", scheme.id);
	  $newRow.append(jQuery("<div></div>").addClass("schemeName").text(scheme.name));
	  for (var colorIndex in scheme.colors){
	    var color = scheme.colors[colorIndex];
	    var $newColorBlock = jQuery("<div></div>").addClass("colorBlock").css("background", module.rgbaToString(color[0], color[1], color[2], 1));
        $newRow.append($newColorBlock);		
	  }
	  return $newRow;
	  
	}
	
	
	module.fillColorSchemes = function(){
	  var $colorSchemePicker = $("#colorSchemePicker");
	  var $defaultRow =jQuery("<div></div>").addClass("colorRow").data("id", "00000");
	  $defaultRow.append(jQuery("<div></div>").addClass("schemeName").text("Default"));
	  $defaultRow.append(jQuery("<div></div>").addClass("defaultColor"));
	  $colorSchemePicker.append($defaultRow);
	  $.each(module.colorSchemes, function(key, value){
	    $colorSchemePicker.append(module.makeColorSchemeRow(value));
	  });
	}
	
	module.randomizeColors = function(){
	   for (var i = 0; i < module.allDots.length; i++){
		var currentDot = module.allDots[i]; 		 
		var randRed = Math.floor(Math.random()*255+1);
	    var randGreen = Math.floor(Math.random()*255+1);
	    var randBlue = Math.floor(Math.random()*255+1);	
		currentDot.red = randRed;
		currentDot.green = randGreen;
		currentDot.blue = randBlue;
       }
	}
	
	
	
	module.changeColorScheme = function(){
	  var newSchemeID = $(this).data("id");
	  if (newSchemeID == "00000"){
	    module.inScheme = false;
		module.currentScheme = null;
		module.randomizeColors();
	  }
	  else{
	    module.inScheme = true;
		
		if (newSchemeID == "1645741" && !module.americaMode){
		  module.fuckYeah();
		  module.americaMode = true;
		}
		else if (newSchemeID != "1645741" && module.americaMode){
		  module.pianoMusic();
		  module.americaMode = false;
		}
		
	    var schemeColors = module.colorSchemes[newSchemeID];
		module.currentScheme = schemeColors;
        for (var i = 0; i < module.allDots.length; i++){
		  var currentDot = module.allDots[i];
		  var newColor = module.currentScheme.randomSchemeColor(schemeColors);
		  currentDot.red = newColor[0];
		  currentDot.green = newColor[1];
		  currentDot.blue = newColor[2];
        } 	  
	  }
	 }
		
     var fadeTime = 200;	
	 module.showSchemes = function(){
	   $("#openSchemes").fadeOut({duration: fadeTime, complete: function(){$("#colorSchemePicker").fadeIn(fadeTime);}});
	   
	 }
	 
	 module.hideSchemes = function(){
	   $("#colorSchemePicker").fadeOut({duration: fadeTime, complete: function(){  $("#openSchemes").fadeIn(fadeTime);}});
	 
	 }
	 
	 module.pianoMusic = function(){
	   module.audioTag.src = $("#piano").attr("src");
	   module.audioTag.load();
	   module.audioTag.play();
	 }
	 
	 module.fuckYeah = function(){
	   module.audioTag.src = $("#america").attr("src");
	   module.audioTag.load();
	   module.audioTag.play();
	 }
	 
     module.getColorPalette = function(){
      var requestHeaders = {format:"json"};
      $.ajax({url:"http://www.colourlovers.com/api/palettes", data:requestHeaders, success: function(){console.log("It worked!")}});   
     }
	
	 module.startApp = function(canvas){
	  module.audioTag = document.getElementById("audioTag");
	  module.audioTag.play();
	  module.canvas = canvas;
	  module.canvas.height = window.innerHeight;
	  module.canvas.width = window.innerWidth;
	  module.loadDefaultColorSchemes();
	  module.fillColorSchemes();
	  
      module.getColorPalette();
              
	  $(".colorRow").click(module.changeColorScheme);
	  $("#clearScreen").click(module.clearDots);
	  $("#openSchemes").mouseenter(module.showSchemes);
	  $("#openSchemes").hide();
	  $("#colorSchemePicker").mouseleave(module.hideSchemes);
	  setTimeout(module.hideSchemes, 1000);
	  $(window).resize(module.resizeHandler);
	  module.canvas.addEventListener("mousedown", module.dotsOn);
	  module.canvas.addEventListener("mouseup", module.dotsOff);
	  setInterval(module.updateDots, 1000/fps);
	};
  
   return module;


})();




  


