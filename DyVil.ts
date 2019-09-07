namespace DyVil{
    export class DyVilView{
        private popupStyle:string="";
        private popupStyleClose:string="";
        private popupStyleOpen:string="";
        private body:HTMLElement = <HTMLElement>document.querySelector("body");
        private chartPopup:HTMLElement = document.createElement("div");
        private documentEvent:any;
        private chartNo:number = 0;
        private chartObj:any;
        private chartType:string[] = ["line","bar","radar","bubble","horizontalBar","polarArea"];
        private dropDownObj:any;
        private chartDataProp:any;
        constructor(private headerforCharts: Array<any>=[],private chartData: Array<any>=[],private chartName: string="",private columnName:string=""){
            this.init();
            this.headerforCharts = [];
            this.chartData = [];
            this.chartName = "";
            this.columnName = "";
        }

        init(){
            this.loadCharJs();
            this.createStartButton();
        }

        loadCharJs(file:string = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.bundle.js"){
            var jsElm = document.createElement("script");
            jsElm.type = "application/javascript";
            jsElm.src = file;
            document.body.appendChild(jsElm);
        }

        createStartButton() {
            let buttonStyle:string = `
                background: rgba(241,231,103,1);
                background: -moz-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);
                background: -webkit-gradient(left top, right top, color-stop(0%, rgba(241,231,103,1)), color-stop(100%, rgba(254,182,69,0.79)));
                background: -webkit-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);
                background: -o-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);
                background: -ms-linear-gradient(left, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);
                background: linear-gradient(to right, rgba(241,231,103,1) 0%, rgba(254,182,69,0.79) 100%);
                filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f1e767', endColorstr='#feb645', GradientType=1 );
                border: none;
                color: white;
                padding: 18px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 50% !important;
                position: fixed;
                right: 50px;
                bottom: 50px;
                z-index: 99999;
                font-weight: 600;
                box-shadow: 3px 2.5px 6px 0px rgba(0,0,0,0.15);
            `;
            let startButton:HTMLElement = document.createElement("BUTTON");
            startButton.setAttribute("style", buttonStyle);
            startButton.innerText="Graph";
            this.chartPopup.setAttribute("class", "dyvil-start-btn");
            this.body.appendChild(startButton);
            startButton.addEventListener('click',this.getTable.bind(this) , false); 
        }

        createChartPopup() {
            let _this = this;
            this.chartNo++;
            this.popupStyle = `
                width: 75vw;
                height: 75vh;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                min-width: 400px;
                min-height: 250px;
                box-shadow: 7px 5.5px 6px 1800px rgba(0,0,0,0.35);
                border: 1px solid rgba(0,0,0,0.1);
                background: #fff;
                transition: all 0.25s;
                padding: 15px;
            `;

            this.popupStyleClose = `
                z-index:-1;
                visibility: hidden;
                transform: translate(-50%,-50%) scale(0.7);
            `;

            this.popupStyleOpen = `
                z-index:99999;
                visibility: visible;
                transform: translate(-50%,-50%) scale(1);
            `;
            this.chartPopup.setAttribute("style", this.popupStyle+this.popupStyleClose);
            this.chartPopup.setAttribute("class", "dyvil-chart-popup");
            this.chartPopup.setAttribute("id", "DyVilChartPopup");
            this.body.appendChild(this.chartPopup);
            this.chartPopup.innerHTML = this.addCloseButton()+this.createChartDropDown()+"<canvas id='chartJSContainer"+this.chartNo+"' width='600' height='400' style='max-width:80%;max-height:80%;'></canvas>"+this.downloadImageBtn();
            this.addEventToTypeDropDown();
            (<HTMLElement>document.getElementById("DyvilClosePopup")).addEventListener("click",this.removePopup.bind(this));
            (<HTMLElement>document.getElementById("DyvilDownloadImg")).addEventListener("click",function(){_this.downloadImage(this,"chartJSContainer"+_this.chartNo,"ChartJS.png")}, false);
        }

        removePopup() {
                let popupContainer:HTMLElement = <HTMLElement>document.getElementById("DyVilChartPopup");
                if(popupContainer){
                    popupContainer.remove();
                }
        }

        getTable(){
            this.headerforCharts = [];
            this.chartData = [];
            this.chartName = "";
            this.columnName = "";
            this.removePopup();
            this.documentEvent = this.documentEventStart.bind(this);
            document.getElementsByTagName("body")[0].style.cursor="crosshair"; 
            document.addEventListener('dblclick',this.documentEvent);
        }

        createChartDropDown():string{
            let dropDown:string = "";
            dropDown = "<div><span> Select chart type : </span>";
            dropDown += "<select id='ChartType'>";
            for(let x=0; x<this.chartType.length;x++){
                dropDown+="<option value='"+this.chartType[x]+"'>"+this.chartType[x]+"</option>";
            }
            dropDown+="</select></div><br/>";
            return dropDown;
        }

        addEventToTypeDropDown(){
            this.dropDownObj = <HTMLInputElement>document.getElementById("ChartType");
            this.dropDownObj.addEventListener("change",this.createChart.bind(this));
        }

        addCloseButton(){
            return `<span id="DyvilClosePopup" class="dyvil-close-popup" style="
            position: absolute;
            right: 20px;
            font-size: 15px;
            font-family: sans-serif;
            display: inline-block;
            border-radius: 100%;
            background: rgba(0,0,0,0.3);
            color: #fff;
            height: 18px;
            width: 20px;
            text-indent: 5px;
            cursor:pointer;
            ">X</span>`;
        }

        downloadImageBtn(){
            return `<br><a id="DyvilDownloadImg">Download Image</a>`;
        }    

        downloadImage(link:any, canvasId:any, filename:any) {
            link.href = (<HTMLCanvasElement>document.getElementById(canvasId)).toDataURL();
            link.download = filename;
        }
        /* Get table on double click*/
        documentEventStart(e:any){
            this.createChartPopup();
            setTimeout(()=>{this.chartPopup.setAttribute("style", this.popupStyle+this.popupStyleOpen);},1);
            try {
                
              e=e||window.event;
              var target =e.target||e.srcElement;
                let i;
                if(target.parentElement != null ) {
                    var x = target.parentElement.nodeName;
                    var tempElement = target;
                    for(i = 0; i<10;i++) {
                        if(tempElement.parentElement == null ) {
                            i=10;
                            break;
                        }
                        if(tempElement.parentElement.nodeName.toUpperCase() == "TABLE") {
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
                if(i==10){
                    setTimeout(()=>{this.removePopup();},1);
                    alert("Table not fount. Please once again click on start button & double click on specific table.");
                }
                else {
                    var att = document.createAttribute("dataVisualizer");
                    tempElement.setAttributeNode(att);
                    this.updatedGetJSON();
                }
                this.documentEventEnd();
            }
            catch(e){
                debugger;
                console.log(e);
                this.documentEventEnd();
                setTimeout(()=>{this.removePopup();},1);
                //alert("Some thing went wrong, please try again.");

            }
        }
    
        documentEventEnd(){
            document.removeEventListener('dblclick',this.documentEvent); 
            document.getElementsByTagName("body")[0].style.cursor="default";
            let tableElement:any = (<HTMLElement>document.querySelectorAll("[dataVisualizer]")[0]);
            if(tableElement) {
                tableElement.removeAttribute("dataVisualizer");
            }
        }

        /*Preparing rough JSON from selected table*/
        updatedGetJSON(){
            let _self = this;
            var myRows:Array<any> = [];
            var headersText:Array<any> = [];
            var $headers = document.querySelectorAll("*[dataVisualizer] th");
            if($headers.length==0){
                $headers = this.SearchHeader();
            }
            var cells:Array<any>;
            var tblRows: any = document.querySelectorAll("*[dataVisualizer] tbody tr");
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
            for(let h=0;h<tblRows.length;h++) {
                cells = tblRows[h].getElementsByTagName("td");
                myRows[h] = {};
                    for(let td=0; td<cells.length; td++){
                        if(headersText[td] === undefined) {
                            headersText[td] = (<string>$headers[td].textContent).trim();
                            _self.headerforCharts[td] = (<string>$headers[td].textContent).trim();
                        }
                        myRows[h][headersText[td]] = (<string>cells[td].textContent).trim();
                    }
                }
/******/
            var myObj = {
                "myrows": myRows
            };
            this.columnName = <string>this.headerforCharts[0];
            this.headerforCharts.shift();
            this.updateJsonForChart(myObj);
            this.createChart();
        }

        updateJsonForChart(data:any){
            var ff=[];
            for(let i in data.myrows){
                var d = data.myrows[i];
                for(let j in d){
                    ff.push(parseFloat(d[j].replace(/[^0-9.-]/g,"")));
                }
                ff.shift();
                if(JSON.stringify(data.myrows[i]) != "{}") {
                    let bgColor:string = this.getRandomColor();
                    this.chartData.push({label:data.myrows[i][this.columnName], data :ff, backgroundColor: bgColor+",0.3)", borderColor: bgColor+",1)",  borderWidth: 2});
                }
                ff=[];
            }
        }

          getRandomInt(min:number, max:number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
          
          getRandomColor(){
              var r = this.getRandomInt(0, 255);
              var g = this.getRandomInt(0, 255);
              var b = this.getRandomInt(0, 255);
              return "rgba(" + r + "," + g + "," + b;
          }

        createChart() {
            let dropDownValue =this.dropDownObj.value;
           if(this.chartObj){
            this.chartObj.destroy();
           }
            
                this.chartDataProp = {
                    type: dropDownValue,
                    data: {
                      labels: this.headerforCharts,
                      datasets: this.chartData
                    }
                  }
              
              let  ctx:any  = <HTMLCanvasElement>document.getElementById('chartJSContainer'+this.chartNo+'');
              ctx.getContext('2d');
              this.chartObj = new Chart(ctx, this.chartDataProp);
              this.chartObj.update();
             (<HTMLAnchorElement>document.getElementById("DyvilDownloadImg")).href = (<HTMLCanvasElement>document.getElementById('chartJSContainer'+this.chartNo)).toDataURL()
        }

        //Getting is previous element table and as headers 
        SearchHeader():NodeListOf<HTMLElement>{
            let table: any = document.querySelectorAll("*[dataVisualizer]");
            let tableHearders = table[0].previousSibling.nodeName.toUpperCase() == "TABLE" ? table.previousSibling.getElementsByTagName("th") : this.SearchHeader1(table[0]); 
            return tableHearders;
        }

        //finding header in table parent previous sibling child nodes
        SearchHeader1(table:HTMLElement):HTMLElement{
            let parentElement:any =  (<HTMLElement>table.parentElement);
            let siblingChild:any  = (<HTMLElement>(<HTMLElement>this.escapeText(parentElement)).previousElementSibling).getElementsByTagName("table");
            let newTableHeader:any;
            if(siblingChild.length > 0){
                newTableHeader = siblingChild[siblingChild.length - 1].getElementsByTagName("th");
            }
            else {
                newTableHeader = this.SearchHeader2(table)
            }
            return newTableHeader;
        }


        SearchHeader2(table:HTMLElement):HTMLElement{
            var newtableHeader:any = table.getElementsByTagName("tr")[0];
            return newtableHeader.getElementsByTagName("td");
        }

        escapeText(element:HTMLElement):HTMLElement{
            for(let i=0;i<10;i++){
                if((<HTMLElement>element.previousSibling).nodeName.toLowerCase() == "text"){
                    element = (<HTMLElement>element.previousSibling);
                }
                else {
                    return element;
                }
            }
            return element;
        }

    }
}

document.addEventListener('DOMContentLoaded', function() {
    var dyVil = new DyVil.DyVilView();
}, false);