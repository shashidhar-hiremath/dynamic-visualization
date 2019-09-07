"use strict";
var DyVil;
(function (DyVil) {
    var DyVilView = /** @class */ (function () {
        function DyVilView(headerforCharts, chartData, chartName, columnName) {
            if (headerforCharts === void 0) { headerforCharts = []; }
            if (chartData === void 0) { chartData = []; }
            if (chartName === void 0) { chartName = ""; }
            if (columnName === void 0) { columnName = ""; }
            this.headerforCharts = headerforCharts;
            this.chartData = chartData;
            this.chartName = chartName;
            this.columnName = columnName;
            this.popupStyle = "";
            this.popupStyleClose = "";
            this.popupStyleOpen = "";
            this.body = document.querySelector("body");
            this.chartPopup = document.createElement("div");
            this.chartNo = 0;
            this.chartType = ["line", "bar", "radar", "bubble", "horizontalBar", "polarArea"];
            this.init();
            this.headerforCharts = [];
            this.chartData = [];
            this.chartName = "";
            this.columnName = "";
        }
        DyVilView.prototype.init = function () {
            this.loadCharJs();
            this.createStartButton();
        };
        DyVilView.prototype.loadCharJs = function (file) {
            if (file === void 0) { file = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.bundle.js"; }
            var jsElm = document.createElement("script");
            jsElm.type = "application/javascript";
            jsElm.src = file;
            document.body.appendChild(jsElm);
        };
        DyVilView.prototype.createStartButton = function () {
            var buttonStyle = "\n                background: rgba(241,231,103,1);\n                background: -moz-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);\n                background: -webkit-gradient(left top, right top, color-stop(0%, rgba(241,231,103,1)), color-stop(100%, rgba(254,182,69,0.79)));\n                background: -webkit-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);\n                background: -o-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);\n                background: -ms-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);\n                background: linear-gradient(to right, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);\n                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f1e767', endColorstr='#feb645', GradientType=1 );\n                border: none;\n                color: white;\n                padding: 18px;\n                text-align: center;\n                text-decoration: none;\n                display: inline-block;\n                font-size: 16px;\n                margin: 4px 2px;\n                cursor: pointer;\n                border-radius: 50% !important;\n                position: fixed;\n                right: 50px;\n                bottom: 50px;\n                z-index: 99999;\n                font-weight: 600;\n                box-shadow: 3px 2.5px 6px 0px rgba(0,0,0,0.15);\n            ";
            var startButton = document.createElement("BUTTON");
            startButton.setAttribute("style", buttonStyle);
            startButton.innerText = "Graph";
            this.chartPopup.setAttribute("class", "dyvil-start-btn");
            this.body.appendChild(startButton);
            startButton.addEventListener('click', this.getTable.bind(this), false);
        };
        DyVilView.prototype.createChartPopup = function () {
            var _this = this;
            this.chartNo++;
            this.popupStyle = "\n                width: 75vw;\n                height: 75vh;\n                position: fixed;\n                top: 50%;\n                left: 50%;\n                transform: translate(-50%,-50%);\n                min-width: 400px;\n                min-height: 250px;\n                box-shadow: 7px 5.5px 6px 1800px rgba(0,0,0,0.35);\n                border: 1px solid rgba(0,0,0,0.1);\n                background: #fff;\n                transition: all 0.25s;\n                padding: 15px;\n            ";
            this.popupStyleClose = "\n                z-index:-1;\n                visibility: hidden;\n                transform: translate(-50%,-50%) scale(0.7);\n            ";
            this.popupStyleOpen = "\n                z-index:99999;\n                visibility: visible;\n                transform: translate(-50%,-50%) scale(1);\n            ";
            this.chartPopup.setAttribute("style", this.popupStyle + this.popupStyleClose);
            this.chartPopup.setAttribute("class", "dyvil-chart-popup");
            this.chartPopup.setAttribute("id", "DyVilChartPopup");
            this.body.appendChild(this.chartPopup);
            this.chartPopup.innerHTML = this.addCloseButton() + this.createChartDropDown() + "<canvas id='chartJSContainer" + this.chartNo + "' width='600' height='400' style='max-width:80%;max-height:80%;'></canvas>" + this.downloadImageBtn();
            this.addEventToTypeDropDown();
            document.getElementById("DyvilClosePopup").addEventListener("click", this.removePopup.bind(this));
            document.getElementById("DyvilDownloadImg").addEventListener("click", function () { _this.downloadImage(this, "chartJSContainer" + _this.chartNo, "ChartJS.png"); }, false);
        };
        DyVilView.prototype.removePopup = function () {
            var popupContainer = document.getElementById("DyVilChartPopup");
            if (popupContainer) {
                popupContainer.remove();
            }
        };
        DyVilView.prototype.getTable = function () {
            this.headerforCharts = [];
            this.chartData = [];
            this.chartName = "";
            this.columnName = "";
            this.removePopup();
            this.documentEvent = this.documentEventStart.bind(this);
            document.getElementsByTagName("body")[0].style.cursor = "crosshair";
            document.addEventListener('dblclick', this.documentEvent);
        };
        DyVilView.prototype.createChartDropDown = function () {
            var dropDown = "";
            dropDown = "<div><span> Select chart type : </span>";
            dropDown += "<select id='ChartType'>";
            for (var x = 0; x < this.chartType.length; x++) {
                dropDown += "<option value='" + this.chartType[x] + "'>" + this.chartType[x] + "</option>";
            }
            dropDown += "</select></div><br/>";
            return dropDown;
        };
        DyVilView.prototype.addEventToTypeDropDown = function () {
            this.dropDownObj = document.getElementById("ChartType");
            this.dropDownObj.addEventListener("change", this.createChart.bind(this));
        };
        DyVilView.prototype.addCloseButton = function () {
            return "<span id=\"DyvilClosePopup\" class=\"dyvil-close-popup\" style=\"\n            position: absolute;\n            right: 20px;\n            font-size: 15px;\n            font-family: sans-serif;\n            display: inline-block;\n            border-radius: 100%;\n            background: rgba(0,0,0,0.3);\n            color: #fff;\n            height: 18px;\n            width: 20px;\n            text-indent: 5px;\n            cursor:pointer;\n            \">X</span>";
        };
        DyVilView.prototype.downloadImageBtn = function () {
            return "<br><a id=\"DyvilDownloadImg\">Download Image</a>";
        };
        DyVilView.prototype.downloadImage = function (link, canvasId, filename) {
            link.href = document.getElementById(canvasId).toDataURL();
            link.download = filename;
        };
        /* Get table on double click*/
        DyVilView.prototype.documentEventStart = function (e) {
            var _this = this;
            this.createChartPopup();
            setTimeout(function () { _this.chartPopup.setAttribute("style", _this.popupStyle + _this.popupStyleOpen); }, 1);
            try {
                e = e || window.event;
                var target = e.target || e.srcElement;
                var i = void 0;
                if (target.parentElement != null) {
                    var x = target.parentElement.nodeName;
                    var tempElement = target;
                    for (i = 0; i < 10; i++) {
                        if (tempElement.parentElement == null) {
                            i = 10;
                            break;
                        }
                        if (tempElement.parentElement.nodeName.toUpperCase() == "TABLE") {
                            tempElement = tempElement.parentElement;
                            break;
                        }
                        else {
                            tempElement = tempElement.parentElement;
                        }
                    }
                }
                else {
                    i = 10;
                }
                if (i == 10) {
                    setTimeout(function () { _this.removePopup(); }, 1);
                    alert("Table not fount. Please once again click on start button & double click on specific table.");
                }
                else {
                    var att = document.createAttribute("dataVisualizer");
                    tempElement.setAttributeNode(att);
                    this.updatedGetJSON();
                }
                this.documentEventEnd();
            }
            catch (e) {
                debugger;
                console.log(e);
                this.documentEventEnd();
                setTimeout(function () { _this.removePopup(); }, 1);
                //alert("Some thing went wrong, please try again.");
            }
        };
        DyVilView.prototype.documentEventEnd = function () {
            document.removeEventListener('dblclick', this.documentEvent);
            document.getElementsByTagName("body")[0].style.cursor = "default";
            var tableElement = document.querySelectorAll("[dataVisualizer]")[0];
            if (tableElement) {
                tableElement.removeAttribute("dataVisualizer");
            }
        };
        /*Preparing rough JSON from selected table*/
        DyVilView.prototype.updatedGetJSON = function () {
            var _self = this;
            var myRows = [];
            var headersText = [];
            var $headers = document.querySelectorAll("*[dataVisualizer] th");
            if ($headers.length == 0) {
                $headers = this.SearchHeader();
            }
            var cells;
            var tblRows = document.querySelectorAll("*[dataVisualizer] tbody tr");
            /******/
            /*tblRows.forEach(function (value:any, index:any) {
            cells = value.getElementsByTagName("td");
            myRows[index] = {};
                for(let td=0; td<cells.length; td++){
                    if(headersText[td] === undefined) {
                        headersText[td] = (<string>$headers[td].textContent).trim();
                        _self.headerforCharts[td] = (<string>$headers[td].textContent).trim();
                    }
                    myRows[index][headersText[td]] = (<string>cells[td].textContent).trim();
                }
            });*/
            /******/
            for (var h = 0; h < tblRows.length; h++) {
                cells = tblRows[h].getElementsByTagName("td");
                myRows[h] = {};
                for (var td = 0; td < cells.length; td++) {
                    if (headersText[td] === undefined) {
                        headersText[td] = $headers[td].textContent.trim();
                        _self.headerforCharts[td] = $headers[td].textContent.trim();
                    }
                    myRows[h][headersText[td]] = cells[td].textContent.trim();
                }
            }
            /******/
            var myObj = {
                "myrows": myRows
            };
            this.columnName = this.headerforCharts[0];
            this.headerforCharts.shift();
            this.updateJsonForChart(myObj);
            this.createChart();
        };
        DyVilView.prototype.updateJsonForChart = function (data) {
            var ff = [];
            for (var i in data.myrows) {
                var d = data.myrows[i];
                for (var j in d) {
                    ff.push(parseFloat(d[j].replace(/[^0-9.-]/g, "")));
                }
                ff.shift();
                if (JSON.stringify(data.myrows[i]) != "{}") {
                    var bgColor = this.getRandomColor();
                    this.chartData.push({ label: data.myrows[i][this.columnName], data: ff, backgroundColor: bgColor + ",0.3)", borderColor: bgColor + ",1)", borderWidth: 2 });
                }
                ff = [];
            }
        };
        DyVilView.prototype.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        DyVilView.prototype.getRandomColor = function () {
            var r = this.getRandomInt(0, 255);
            var g = this.getRandomInt(0, 255);
            var b = this.getRandomInt(0, 255);
            return "rgba(" + r + "," + g + "," + b;
        };
        DyVilView.prototype.createChart = function () {
            var dropDownValue = this.dropDownObj.value;
            if (this.chartObj) {
                this.chartObj.destroy();
            }
            this.chartDataProp = {
                type: dropDownValue,
                data: {
                    labels: this.headerforCharts,
                    datasets: this.chartData
                }
            };
            var ctx = document.getElementById('chartJSContainer' + this.chartNo + '');
            ctx.getContext('2d');
            this.chartObj = new Chart(ctx, this.chartDataProp);
            this.chartObj.update();
            document.getElementById("DyvilDownloadImg").href = document.getElementById('chartJSContainer' + this.chartNo).toDataURL();
        };
        //Getting is previous element table and as headers 
        DyVilView.prototype.SearchHeader = function () {
            var table = document.querySelectorAll("*[dataVisualizer]");
            var tableHearders = table[0].previousSibling.nodeName.toUpperCase() == "TABLE" ? table.previousSibling.getElementsByTagName("th") : this.SearchHeader1(table[0]);
            return tableHearders;
        };
        //finding header in table parent previous sibling child nodes
        DyVilView.prototype.SearchHeader1 = function (table) {
            var parentElement = table.parentElement;
            var siblingChild = this.escapeText(parentElement).previousElementSibling.getElementsByTagName("table");
            var newTableHeader;
            if (siblingChild.length > 0) {
                newTableHeader = siblingChild[siblingChild.length - 1].getElementsByTagName("th");
            }
            else {
                newTableHeader = this.SearchHeader2(table);
            }
            return newTableHeader;
        };
        DyVilView.prototype.SearchHeader2 = function (table) {
            var newtableHeader = table.getElementsByTagName("tr")[0];
            return newtableHeader.getElementsByTagName("td");
        };
        DyVilView.prototype.escapeText = function (element) {
            for (var i = 0; i < 10; i++) {
                if (element.previousSibling.nodeName.toLowerCase() == "text") {
                    element = element.previousSibling;
                }
                else {
                    return element;
                }
            }
            return element;
        };
        return DyVilView;
    }());
    DyVil.DyVilView = DyVilView;
})(DyVil || (DyVil = {}));
document.addEventListener('DOMContentLoaded', function () {
    var dyVil = new DyVil.DyVilView();
}, false);
