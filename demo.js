$(function () {
    var viewModel = {
        mainExampleValue: ko.observable(-5.234),
        testValue1: ko.observable(5),
        testValue2: ko.observable(-12.4)
    };
    ko.applyBindings(viewModel);

    $("#exampleSingle").sevenSeg({ value: 7 });
    $("#exampleArray").sevenSegArray({ digits: 5, value: 12.35 });

    setInterval(function() {
        var value = +viewModel.mainExampleValue() + 0.001;
        viewModel.mainExampleValue(value.toFixed(3));
    }, 100);

    $("#testResizableDiv").resizable({aspectRatio: true});
    $("#testSegInsideResizable").sevenSeg({value: 8});

    $("#testResizableArray").sevenSegArray({ digits: 3 });
    $("#testResizableDiv2").resizable({aspectRatio: true});
    var iArrayValue = 0;
    setInterval(function() {
        $("#testResizableArray").sevenSegArray({ value: iArrayValue });
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

    prettyPrint();
});
