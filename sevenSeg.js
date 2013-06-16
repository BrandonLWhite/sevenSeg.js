(function($) {

var numberSegments = [0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F]; //http://en.wikipedia.org/wiki/Seven-segment_display

// Default CSS styles. If you don't specify your own CSS or discrete color options, this is what gets used.
// 
$("<style type='text/css'>" 
    + ".sevenSeg-svg {fill: #320000; overflow: hidden; stroke-width: 0; height: 100%; width: 100%; background-color: Black}"
    + ".sevenSeg-segOn {fill: Red}"
    + "</style>")
    .prependTo("head");

$.widget("bw.sevenSeg", {

options: {
    value: null,
    colorOn: null,
    colorOff: null,
    colorBackground: null,
    
    /**
    Note: Setting "transform: skew()" in CSS is problematic for SVG. Would be nice to have, but browser support just 
    isn't there yet. So, setting the slant must be done through options.
    */
    slant: 0,  

    decimalPoint: true
},		

/**
Widget factory creation handler.
*/
_create: function () {
    this.jqSvgElement = $("<svg/>", {
        class: this.widgetName + "-svg",
        viewBox: "0 0 57 80",
        version: "1.1", 
        xmlns: "http://www.w3.org/2000/svg", 
        "xmlns:xlink":"http://www.w3.org/1999/xlink"
    })
    .css({fill: this.options.colorOff, "background-color": this.options.colorBackground})    ;

    $("<defs/>")
        .append($("<polyline/>", {id: "h-seg", points:"11 0, 37 0, 42 5, 37 10, 11 10, 6 5"}))
        .append($("<polyline/>", {id: "v-seg", points:"0 11, 5 6, 10 11, 10 34, 5 39, 0 39"}))
        .appendTo(this.jqSvgElement);
    
    this.jqSegments = $("<g/>", {class: this.widgetName + "-segGroup"})
        .append($("<use/>", {"xlink:href": "#h-seg", x: "0", y: "0"}))                                  //Segment A
        .append($("<use/>", {"xlink:href": "#v-seg", x: "-48", y: "0", transform: "scale(-1,1)"}))      //Segment B
        .append($("<use/>", {"xlink:href": "#v-seg", x: "-48", y: "-80", transform: "scale(-1,-1)"}))   //Segment C
        .append($("<use/>", {"xlink:href": "#h-seg", x: "0", y: "70"}))                                 //Segment D
        .append($("<use/>", {"xlink:href": "#v-seg", x: "0", y: "-80", transform: "scale(1,-1)"}))      //Segment E
        .append($("<use/>", {"xlink:href": "#v-seg", x: "0", y: "0"}))                                  //Segment F
        .append($("<use/>", {"xlink:href": "#h-seg", x: "0", y: "35"}))                                 //Segment G
        .appendTo(this.jqSvgElement);

    if(this.options.slant) {
        this.jqSegments.attr("transform", "skewX(" + -this.options.slant + ")");
    }

    if(this.options.decimalPoint) {
        $("<circle/>", {cx:"52", cy:"75", r:"5"}).appendTo(this.jqSvgElement);
    }
    
    this.jqSvgElement.appendTo(this.element);
    this.element.append(this.jqSvgElement);
    
    // http://stackoverflow.com/a/13654655/390906
    //
    this.element.html(this.element.html());
    this.jqSvgElement = this.element.find("svg");
    this.jqSegments = this.jqSvgElement.find("." + this.widgetName + "-segGroup");

    if(this.options.value) {
        this.displayValue(this.options.value);
    }
},

_destroy: function() {
    this.jqSvgElement.remove();
},

_setOption: function(key, value){
	this.options[key] = value;

	switch(key){
		case "value":
			this.displayValue(value);
			break;
	}
},

/**
Call with null to blank out the display.
*/
displayValue: function(value, bDecimalPoint) {
    var self = this;
    if(value >= numberSegments.length) return;
    self.options.value = value;
    var segments = self._getSegments(value);
    self.jqSegments.children().each(function(index, element) {                     
        self._setSvgElementFill($(element), segments & (1 << index));        
    });
    
    self._setSvgElementFill(self.jqSvgElement.find("circle"), bDecimalPoint);
},

_getSegments: function(value) {
    if(value === "-") return 0x40;
    return numberSegments[value];
},

_setSvgElementFill: function(jqElement, bOn) {
    // jQuery addClass/removeClass doesn't work with svg <use> elements. So we have to do it the old way.
    //
    jqElement.attr("class", bOn && (this.widgetName + "-segOn"));
    
    // Set the fill style if options.colorOn is defined. This overrides CSS definitions.
    //
    jqElement.css("fill", (bOn && this.options.colorOn) || "");
}

});

// Plugin Knockout binding handler for sevenSeg if KO is defined.
//
if(ko && ko.bindingHandlers) {
	ko.bindingHandlers.sevenSeg = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {        
			$(element).sevenSeg(ko.toJS(valueAccessor()));
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {        
			$(element).sevenSeg("option", ko.toJS(valueAccessor()));
		}
	};
}

/**
TODO BW DOCME
*/
$.widget("bw.sevenSegArray", {

options: {
    value: null,
    digits: 2,
    segmentOptions: null
},		

/**
Widget factory creation handler.
*/
_create: function () {
    this.aJqDigits = [];
    var sDigitWidth = 100/this.options.digits + "%";
    for(var iDigit = 0; iDigit < this.options.digits; ++iDigit) {
        this.aJqDigits[iDigit] = $("<div/>", {style: "display: inline-block; height: 100%;"})
            .css("width", sDigitWidth) 
            .sevenSeg(this.options.segmentOptions)
            .appendTo(this.element);
    }
    this.aJqDigits.reverse();
    if(this.options.value) {
        this.displayValue(this.options.value);
    }
},

_destroy: function() {
    $.each(this.aJqDigits, function(index, jqDigit) {
        jqDigit.sevenSeg("destroy");
        jqDigit.remove();
    });
},

_setOption: function(key, value){
	this.options[key] = value;
 
	switch(key){
		case "value":
			this.displayValue(value);
			break;
        
        // TODO BW : Add other options.
	}    
},

/**
Call with null to blank out the display.
*/
displayValue: function(value) {
    var self = this;    
    var sValue = value.toString();
    var iDecimalIdx = sValue.indexOf('.');
    var iDigitIdx = sValue.length - 1;
    $.each(self.aJqDigits, function(index, jqDigit) {
        var bDecimal = iDecimalIdx >= 0 && iDigitIdx === iDecimalIdx;
        if(bDecimal) {
            --iDigitIdx;
        }

        var sDigitValue = sValue[iDigitIdx];        
        jqDigit.sevenSeg("displayValue", sDigitValue, bDecimal);
        
        --iDigitIdx;
    });
}

});

// Plugin Knockout binding handler for sevenSegArray if KO is defined.
//
if(ko && ko.bindingHandlers) {
	ko.bindingHandlers.sevenSegArray = {
		init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {        
			$(element).sevenSegArray(ko.toJS(valueAccessor()));
		},
		update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {        
			$(element).sevenSegArray("option", ko.toJS(valueAccessor()));
		}
	};
}

})(jQuery);
