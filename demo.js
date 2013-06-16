$(function () {
    var viewModel = {
        testVal1 : ko.observable(5),
        testVal2 : ko.observable(-12.4)
    };
    ko.applyBindings(viewModel);

    $("#example1").sevenSeg();

    var iValue = 0;
    setInterval(function() {
        $("#example1").sevenSeg({value: iValue});
        if(++iValue > 9) {
			iValue = 0;
		}
    }, 200);

    $("#testResizableDiv").resizable({aspectRatio: true});
    $("#testSegInsideResizable").sevenSeg({value: 8});

    $("#testArray").sevenSegArray({digits:3});    
    $("#testResizableDiv2").resizable({aspectRatio: true});
    var iArrayValue = 0;
    setInterval(function() {
        $("#testArray").sevenSegArray({value: iArrayValue});
        if(++iArrayValue > 999) { 
			iArrayValue = 0; 
		}
    }, 50);

    $("#testArray1").sevenSegArray({
		digits:5, 
		value:-98.76, 
		segmentOptions: {
			colorOff: "#003200", 
			colorOn: "Lime", 
			slant: 10
		}
	});
    
    $("#btnCreate").click(function() {
        $("#testArray2").sevenSegArray({digits:4, value:12.34});
    });

    $("#btnDestroy").click(function() {
        $("#testArray2").sevenSegArray("destroy");
    });
});
