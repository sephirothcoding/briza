var RENDERER = {
	init : function(){
		this.setParameters();
		this.reconstructMethods();
		this.render();
	},
	setParameters : function(){
		this.$container = $('#jsi-butterfly-container');
		this.width = this.$container.width();
		this.height = this.$container.height();
		this.context = $('<canvas />').attr({width : this.width, height : this.height}).appendTo(this.$container).get(0).getContext('2d');
		this.butterflies = [new BUTTERFLY(this)];
		this.particles = [];
		this.count = this.getRandomValue(100, 300);
	},
	reconstructMethods : function(){
		this.render = this.render.bind(this);
	},
	getRandomValue : function(min, max){
		return min + (max - min) * Math.random();
	},
	render : function(){
		requestAnimationFrame(this.render);
		
		var context = this.context;
		context.save();
		context.fillStyle = 'hsla(0, 0%, 0%, 0.3)';
		context.fillRect(0, 0, this.width, this.height);
		context.globalCompositeOperation = 'lighter';
		
		for(var i = this.particles.length - 1; i >= 0; i--){
			if(!this.particles[i].render(context)){
				this.particles.splice(i, 1);
			}
		}
		context.restore();
		
		for(var i = this.butterflies.length - 1; i >= 0; i--){
			if(!this.butterflies[i].render(context)){
				this.butterflies.splice(i, 1);
			}
		}
		if(--this.count < 0){
			this.count = this.getRandomValue(100, 300);
			this.butterflies.push(new BUTTERFLY(this));
		}
	}
};
var BUTTERFLY = function(renderer){
	this.renderer = renderer;
	this.init();
};
BUTTERFLY.prototype = {
	DELTA_THETA : Math.PI / 50,
	DELTA_PHI : Math.PI / 100,
	THRESHOLD : 100,
	DELTA_PARTICLE : 2,
	
	init : function(){
		this.theta = 0;
		this.phi = 0;
		this.x = this.renderer.getRandomValue(this.THRESHOLD, this.renderer.width - this.THRESHOLD);
		this.y = this.renderer.height + this.THRESHOLD;
		this.vx = 0;
		this.vy = -2;
		this.swingRate = this.renderer.getRandomValue(0.5, 1);
	},
	createParticles : function(){
		for(var i = 0; i < this.DELTA_PARTICLE; i++){
			this.renderer.particles.push(new PARTICLE(this.renderer, this.x, this.y));
		}
		return this.y >= -this.THRESHOLD;
	},
	render : function(context){
		context.save();
		context.translate(this.x, this.y);
		context.rotate(Math.atan2(this.vx, -this.vy) / 10);
		
		for(var i = -1; i <= 1; i += 2){
			context.save();
			context.scale(i, 1);
			
			var gradient = context.createRadialGradient(0, 0, 0, 0, 0, 80),
				rate = Math.sin(this.theta / 4);
			gradient.addColorStop(0, 'hsl(45, 100%, 50%)');
			gradient.addColorStop(0.3, 'hsl(291, 46%,  ' + (76 + 10 * rate) +  '%)');
			gradient.addColorStop(0.5, 'hsl(291, 46%, ' + (76 + 20 * rate) +  '%)');
			gradient.addColorStop(1, 'hsl(291, 46%, ' + (76 + 30 * rate) +  '%)');
			context.lineWidth = 3;
			context.strokeStyle = 'hsl(45, 100%, 50%)';
			context.fillStyle = gradient;
			
			context.save();
			context.scale(0.8 + 0.2 * Math.cos(this.theta + Math.PI / 10), 1);
			context.beginPath();
			context.moveTo(-3, 0);
			context.bezierCurveTo(-40, -10, -60, 20, -30, 40);
			context.bezierCurveTo(-20, 50, -10, 50, -3, -5);
			context.closePath();
			context.fill();
			context.stroke();
			context.restore();
			
			context.save();
			context.scale(0.8 + 0.2 * Math.cos(this.theta), 1);
			context.beginPath();
			context.moveTo(-3, -5);
			context.bezierCurveTo(-25, -60, -75, -55, -65, -35);
			context.bezierCurveTo(-55, -10, -65, 5, -3, 0);
			context.closePath();
			context.fill();
			context.stroke();
			context.restore();
			
			context.lineWidth = 2;
			context.strokeStyle = 'hsl(45, 100%, 50%)';
			context.beginPath();
			context.moveTo(-2, -10);
			context.bezierCurveTo(-5, -20, -3 - Math.sin(this.theta), -30, -8 - Math.sin(this.theta), -40);
			context.stroke();
			context.restore();
		}
		context.save();
		var gradient = context.createLinearGradient(-3, 0, 3, 0);
		gradient.addColorStop(0, 'hsl(45, 100%, 50%)');
		gradient.addColorStop(0.5, 'hsl(45, 100%, 50%)');
		gradient.addColorStop(1, 'hsl(45, 100%, 50%)');
		context.fillStyle = gradient;
		context.beginPath();
		context.moveTo(0, -10);
		context.arc(0, -10, 3, 0, Math.PI * 2, false);
		context.fill();
		
		context.beginPath();
		context.moveTo(3, -8);
		context.arc(0, -8, 3, 0, Math.PI, false);
		context.stroke();
		context
