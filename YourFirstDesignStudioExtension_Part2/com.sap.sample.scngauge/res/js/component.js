sap.designstudio.sdk.Component.subclass("com.sap.sample.scngauge.SCNGauge", function() {

	var that = this;

	this.init = function() {

		var myDiv = that.$()[0];
		var vis = d3.select(myDiv).append("svg:svg").attr("width", "100%").attr("height", "100%");
		var pi = Math.PI;
	    
		var arc = d3.svg.arc()
		    .innerRadius(0)
		    .outerRadius(70)
		    .startAngle(45 * (pi/180)) //converting from degs to radians
		    .endAngle(3) //just radians
		    
		vis.attr("width", "400").attr("height", "400") // Added height and width so arc is visible
		    .append("path")
		    .attr("d", arc)
		    .attr("fill", "red")
		    .attr("transform", "translate(200,200)");

	};


});