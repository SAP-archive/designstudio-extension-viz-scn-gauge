sap.designstudio.sdk.PropertyPage.subclass("com.sap.sample.scngauge.SCNGaugePropertyPage",  function() {

	var me = this;
	
	//Viz definitiions
	me.lineThickness = 2;

	//Outer Dimensions & Positioning
	me._paddingTop = 0;
	me._paddingBottom = 0;
	me._paddingLeft = 0;
	me._paddingRight = 0;
	
	//Height and Width Proxies
	me._widthProxy = 200;
	me._heightProxy = 200;


	me.init = function() {
		$("#form").submit(function() {
			me._paddingTop = parseInt($("#aps_padding_top").val());
			me._paddingBottom = parseInt($("#aps_padding_bottom").val());
			me._paddingLeft = parseInt($("#aps_padding_left").val());
			me._paddingRight = parseInt($("#aps_padding_right").val());
			
			me.firePropertiesChanged(["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"]);
			me.redraw();
			return false;
		});
		me.redraw();
	};

	me.paddingTop = function(value) {
		if (value === undefined) {
			return me._paddingTop 
		}
		else {
			me._paddingTop = value;
			me.redraw();
			return me;
		}
	};
	
	me.paddingBottom = function(value) {
		if (value === undefined) {
			return me._paddingBottom 
		}
		else {
			me._paddingBottom = value;
			me.redraw();
			return me;
		}
	};
	
	me.paddingLeft = function(value) {
		if (value === undefined) {
			return me._paddingLeft ;
		}
		else {
			me._paddingLeft = value;
			me.redraw();
			return me;
		}
	};
	
	me.paddingRight = function(value) {
		if (value === undefined) {
			return me._paddingRight; 
		}
		else {
			me._paddingRight = value;
			me.redraw();
			return me;
		}
	};
	
	me.redraw = function() {
		//Update the height and width by getting them from the canvas
		me._widthProxy = me.callRuntimeHandler("getWidth");
		me._heightProxy = me.callRuntimeHandler("getHeight");
		
		$("#aps_padding_top").val(me._paddingTop);
		$("#aps_padding_bottom").val(me._paddingBottom);
		$("#aps_padding_left").val(me._paddingLeft);
		$("#aps_padding_right").val(me._paddingRight);
		$("#aps_width").text(me._widthProxy);
		$("#aps_height").text(me._heightProxy);
		
		// Clear any existing content.  We'll redraw from scratch
		d3.select("#content").selectAll("*").remove();
		var vis = d3.select("#content").append("svg:svg").attr("width", "100%").attr("height", "100%");
		var pi = Math.PI;

		//Line Accessor Function
		var lineAccessor = d3.svg.line()
			.x(function(d) { return d.x; })
			.y(function(d) { return d.y; })
			.interpolate("linear");


		///////////////////////////////////////////
		//Gauge Dummy
		///////////////////////////////////////////

		//Determing the position of the gauge dummy (black circle)
		// Find the larger left/right padding
		var lrPadding = me._paddingLeft + me._paddingRight;
		var tbPadding = me._paddingTop + me._paddingBottom;
		var maxPadding = lrPadding;
		if (maxPadding < tbPadding){
			maxPadding = tbPadding
		}

		//Do the same with the overall height and width
		var smallerAxis = me._heightProxy;
		if (me._widthProxy < smallerAxis){
			smallerAxis = me._widthProxy
		}
						
		var outerRad = (smallerAxis - 2*(maxPadding))/2;
		$("#aps_radius").text(outerRad);

		//The offset will determine where the center of the arc shall be
		var offsetLeft = outerRad + me._paddingLeft;
		var offsetDown = outerRad + me._paddingTop;

		//The black Circle
		var arcDef = d3.svg.arc()
			.innerRadius(0)
			.outerRadius(outerRad)
			.startAngle(-180 * (pi/180)) //converting from degs to radians
			.endAngle(180 * (pi/180)); //converting from degs to radians

		var guageDummy = vis.append("path")
			.style("fill", "black")
			.attr("width", me._widthProxy).attr("height", me._heightProxy) // Added height and width so arc is visible
			.attr("transform", "translate(" + offsetLeft + "," + offsetDown + ")")
			.attr("d", arcDef);
	
	
		///////////////////////////////////////////
		//Line Data
		///////////////////////////////////////////
		var lineDataOuter = [{"x":0, "y":0}, {"x": me._widthProxy, "y":0}, {"x": me._widthProxy, "y":me._heightProxy}, {"x":0, "y":me._heightProxy}, {"x":0, "y":0}];
		var lineDataPaddingLeft = [{"x":0, "y":0}, {"x":me._paddingLeft, "y":0}, {"x":me._paddingLeft, "y":me._heightProxy}, {"x":0, "y":me._heightProxy}, {"x":0, "y":0}];
		var lineDataPaddingRight = [{"x":( me._widthProxy - me._paddingRight), "y":0}, {"x": me._widthProxy, "y":0}, {"x": me._widthProxy, "y":me._heightProxy}, {"x":( me._widthProxy - me._paddingRight), "y":me._heightProxy}, {"x":( me._widthProxy - me._paddingRight), "y":0}];
		var lineDataPaddingUpper= [{"x":0, "y":0}, {"x": me._widthProxy, "y":0}, {"x": me._widthProxy, "y":me._paddingTop}, {"x":0, "y":me._paddingTop}, {"x":0, "y":0}];
		var lineDataPaddingLower = [{"x":0, "y":(me._heightProxy - me._paddingBottom)}, {"x": me._widthProxy, "y":(me._heightProxy - me._paddingBottom)}, {"x": me._widthProxy, "y":me._heightProxy}, {"x":0, "y":me._heightProxy}, {"x":0, "y":(me._heightProxy - me._paddingBottom)}];

		var lineDataCrosshairsHorizontal = [{"x":me._paddingLeft, "y":(me._paddingTop + outerRad) }, {"x":(me._paddingLeft + 2*outerRad), "y":(me._paddingTop + outerRad) }];
		var lineDataCrosshairsVertical = [{"x":(me._paddingLeft  + outerRad), "y":me._paddingTop }, {"x":(me._paddingLeft  + outerRad), "y":(me._paddingTop + 2*outerRad) }];


		var borderLinesPaddingLeft = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataPaddingLeft))
			.attr("stroke", "blue")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	
		var borderLinesPaddingRight = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataPaddingRight))
			.attr("stroke", "blue")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	
		var borderLinesPaddingUpper = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataPaddingUpper))
			.attr("stroke", "blue")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	
		var borderLinesPaddingLower = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataPaddingLower))
			.attr("stroke", "blue")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	

		var borderLinesOuter = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataOuter))
			.attr("stroke", "black")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	
		var borderLinesCrosshairHorizontal = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataCrosshairsHorizontal))
			.attr("stroke", "white")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");	
		var borderLinesCrosshairVertical = vis
			.attr("width",  me._widthProxy).attr("height", me._heightProxy) // Added height and width so line is visible
			.append("path")
			.attr("d", lineAccessor(lineDataCrosshairsVertical))
			.attr("stroke", "white")
			.attr("stroke-width", me.lineThickness)
			.attr("fill", "none");
	}
});