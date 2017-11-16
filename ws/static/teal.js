/* global Mustache, XMLHttpRequest, c3 */

var submitButton = document.getElementById('submit-button')
submitButton.addEventListener('click', submit)
var navFwBitButton = document.getElementById('teal-nav-fw-bit')
navFwBitButton.addEventListener('click', tealNavFwBit)
var navFwWinButton = document.getElementById('teal-nav-fw-win')
navFwWinButton.addEventListener('click', tealNavFwWin)


var spinnerHtml = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
var sectionResults = document.getElementById('results')
var sectionResults2 = document.getElementById('results2')

var tealWinXst = 0;
var tealWinXend = 600;
var tealWinYend = 2300;
var tealAllResults;

function tealNavFwBit() {
    var retVal = tealCreateSVG(tealAllResults,tealWinXst,tealWinXend,tealWinYend,0,1000,0,200);
    tealDigShowSVG(retVal, 1200, 500);
}


function tealNavFwWin() {
    var step = tealWinXend - tealWinXst;
    tealWinXst += step;
    tealWinXend += step;
    var retVal = tealCreateSVG(tealAllResults,tealWinXst,tealWinXend,tealWinYend,0,1000,0,200);
    tealDigShowSVG(retVal, 1200, 500);
}

function submit () {
    var file = document.getElementById('experiment').files[0];
    var data = new FormData();
    data.append('experiment', file);
    var req = new XMLHttpRequest()
    req.addEventListener('load', function (ev) {
      var res = JSON.parse(ev.target.response)
      if (ev.target.status === 200) {
        displayResults(res)
        displayResults2(res)
      } else {
        sectionResults.innerHTML = '<div class="error">' + res.error + '</div>'
      }
    })
    req.open('POST', '/upload', true)
    req.send(data)
    sectionResults.innerHTML = spinnerHtml
    sectionResults2.innerHTML = spinnerHtml
}

function displayResults (results) {
    sectionResults.innerHTML = '<div id="chart"></div>'
    c3.generate({
	bindto: '#chart',
	padding: {
	    bottom: 75,
	},
	data: {
	    x: 'pos',
	    columns: [
		['pos'].concat(results.pos),
		['A'].concat(results.peakA),
		['C'].concat(results.peakC),
		['G'].concat(results.peakG),
		['T'].concat(results.peakT)
	    ],
	    type: "spline",
	},
	point: {
	    show: false
	},
	axis: {
	    x: {
		label: "Position",
		tick: {
		    rotate: -90,
		    values: results.basecallPos,
		    format: function (x) {
			return results.basecalls[x.toString()];
		    }
		},
		extent: [1, 500]
	    }
	},
	zoom: {
	    enabled: true
	}
    })
}

function displayResults2 (results) {
    tealAllResults = results;
    var retVal = tealCreateSVG(tealAllResults,tealWinXst,tealWinXend,tealWinYend,0,1000,0,200);
    tealDigShowSVG(retVal, 1200, 500);
}

function tealDigShowSVG(svg, x, y) {
    var retVal = svg;
    var regEx1 = /</g;
    retVal = retVal.replace(regEx1, "%3C");
    var regEx2 = />/g;
    retVal = retVal.replace(regEx2, "%3E");
    var regEx3 = /#/g;
    retVal = retVal.replace(regEx3, "%23");
    retVal = '<img src="data:image/svg+xml,' + retVal;
    retVal += '" alt="Digest-SVG" width="' + x + '" height="' + y +'">';
    sectionResults2.innerHTML = retVal;
}

function tealCreateSVG(tr,startX,endX,endY,wdXst,wdXend,wdYst,wdYend) {
    var retVal = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='-100 -100 1200 1200'>";

    retVal += tealCreateAllCalls(tr,startX,endX,endY,wdXst,wdXend,wdYst,wdYend);
    retVal += tealCreateCoodinates (tr,startX,endX,endY,wdXst,wdXend,wdYst,wdYend);

    retVal += "</svg>";
    return retVal;
}

function tealCreateCoodinates (tr,startX,endX,endY,wdXst,wdXend,wdYst,wdYend){
    var lineXst = wdXst - 5;
    var lineXend = wdXend + 5;
    var lineYst = wdYst - 5;
    var lineYend = wdYend + 5;
    var retVal = "<line x1='" + lineXst + "' y1='" + lineYend;
    retVal += "' x2='" + lineXend + "' y2='" + lineYend + "' stroke-width='2' stroke='black' stroke-linecap='square'/>";
    retVal += "<line x1='" + lineXst + "' y1='" + lineYst;
    retVal += "' x2='" + lineXst + "' y2='" + lineYend + "' stroke-width='2' stroke='black' stroke-linecap='square'/>";

    // The X-Axis
    for (var i = 0; i < tr.basecallPos.length; i++) {
        if ((parseFloat(tr.basecallPos[i]) > startX) &&
            (parseFloat(tr.basecallPos[i]) < endX)) {
            var xPos = wdXst + (parseFloat(tr.basecallPos[i]) - startX) / (endX - startX)  * (wdXend - wdXst);
            retVal += "<line x1='" + xPos + "' y1='" + lineYend;
            retVal += "' x2='" + xPos + "' y2='" + (lineYend + 7)+ "' stroke-width='1' stroke='black' />";
            retVal += "<text x='" + (xPos + 3) + "' y='" + (lineYend + 11);
            retVal += "' font-family='Arial' font-size='10' fill='black' text-anchor='end' transform='rotate(-90 ";
            retVal += (xPos + 3) + "," + (lineYend + 11) + ")'>";
            retVal += tr.basecalls[tr.basecallPos[i]] + "</text>";
        } 
    }
    // The Y-Axis
    var yPow = Math.pow(10, Math.floor(Math.log10(endY/10)));
    var yStep = Math.floor(endY/10/yPow) * yPow;
    for (var i = 0; i * yStep < endY; i++) {
        var yPos = wdYend - i * yStep / endY * (wdYend - wdYst);
        retVal += "<line x1='" + lineXst + "' y1='" + yPos;
        retVal += "' x2='" + (lineXst - 7) + "' y2='" + yPos + "' stroke-width='1' stroke='black' />";
        retVal += "<text x='" + (lineXst - 11) + "' y='" + (yPos + 3);
        retVal += "' font-family='Arial' font-size='10' fill='black' text-anchor='end'>";
        retVal += (i * yStep) + "</text>";
    }
   
    var sqrY = wdYend + 70;
    var txtY = wdYend + 81;
    retVal += "<rect x='400' y='" + sqrY + "' width='10' height='10' style='fill:green;stroke-width:3;stroke:green' />";
    retVal += "<text x='417' y='" + txtY + "' font-family='Arial' font-size='18' fill='black'>A</text>";
    retVal += "<rect x='450' y='" + sqrY + "' width='10' height='10' style='fill:blue;stroke-width:3;stroke:blue' />";
    retVal += "<text x='467' y='" + txtY + "' font-family='Arial' font-size='18' fill='black'>C</text>";
    retVal += "<rect x='500' y='" + sqrY + "' width='10' height='10' style='fill:black;stroke-width:3;stroke:black' />";
    retVal += "<text x='517' y='" + txtY + "' font-family='Arial' font-size='18' fill='black'>G</text>";
    retVal += "<rect x='550' y='" + sqrY + "' width='10' height='10' style='fill:red;stroke-width:3;stroke:red' />";
    retVal += "<text x='567' y='" + txtY + "' font-family='Arial' font-size='18' fill='black'>T</text>";

    return retVal;
}

function tealCreateAllCalls(tr,startX,endX,endY,wdXst,wdXend,wdYst,wdYend){
    var retVal = tealCreateOneCalls(tr.peakA,"green",startX,endX,endY,wdXst,wdXend,wdYst,wdYend);
    retVal += tealCreateOneCalls(tr.peakC,"blue",startX,endX,endY,wdXst,wdXend,wdYst,wdYend);
    retVal += tealCreateOneCalls(tr.peakT,"red",startX,endX,endY,wdXst,wdXend,wdYst,wdYend);
    retVal += tealCreateOneCalls(tr.peakG,"black",startX,endX,endY,wdXst,wdXend,wdYst,wdYend);
    return retVal;
}

function tealCreateOneCalls(trace,col,startX,endX,endY,wdXst,wdXend,wdYst,wdYend){
    var retVal = "<polyline fill='none' stroke-linejoin='round' stroke='" + col + "' points='";
    for (var i = startX; i < endX; i++) {
        if(!(typeof trace[i] === 'undefined')){
            var iden = parseFloat(trace[i]) / endY;
            if (iden > 1.0) {
                iden = 1;
            }
            var xPos = wdXst + (i - startX) / (endX - startX)  * (wdXend - wdXst);
            var yPos = wdYend - iden * (wdYend - wdYst);
            retVal += xPos + "," + yPos + " ";
        } 
    }
    retVal += "'/>";
    return retVal;
}



