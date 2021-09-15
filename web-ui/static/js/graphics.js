
var plotsChart = {
    department    : '',
    check_stage   : '',
    city          : '',
    startDate     : '',
    endDate       : '',
    provider      : '',
    funding       : '',
    program       : '',
    adjudication  : '',
    chartType     : '',
    groupChartBy  : '',
    domainChart   : '',
    countProjClick: 0,
    typeHighChart : '',
    allowGetData  : true,
    functionClick : function(){;},
    functionAfterClickChart : '',
    chartTitle    : {
        obras: 0,
        amount: 0,
        titleGral : '',
        setTitle: function(){
            var amount = parseInt(this.amount/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            var city = this.titleGral;
            var period = document.getElementById('periodDateChart');
            var pp = period.options[period.selectedIndex].innerHTML
            $('#titleChartGral').html(city);
            return 'TOTAL DE OBRAS ' + this.obras + '<br>$' + amount + ' K <br> <span style="color:#335;font-size:0.85em;">' + pp + '</span>'; 
        }
    },
    initStatusPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'pieStatus';
        plotsChart.typeHighChart = 'pie';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
        plotsChart.getData();
        
        //$('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initDates: function() {
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType     = 'barDates';
        plotsChart.typeHighChart = 'column';
        plotsChart.groupChartBy  = 'byAmount';
        plotsChart.domainChart   = 'dates';
        plotsChart.functionAfterClickChart = '';
        plotsChart.functionClick = function(s) {
            plotsChart.startDate = plotsChart.startDateChart.substring(0, 4) == s ? plotsChart.startDateChart : s + '-01-01';
            plotsChart.endDate   = plotsChart.endDateChart.substring(0, 4)   == s ? plotsChart.endDateChart   : s + '-12-31';
            plotsChart.openUrl();
        };
        plotsChart.getData();
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');
        $('#botonShowChartBy').css('display','none');
        $('#botonOnlyShowInProcess').css('display','block');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal1' ).attr('active','');    
    },
    initStackCities : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'barCities';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'cities';
        plotsChart.functionAfterClickChart   = 'cities';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal2' ).attr('active','');
    },
    initDepartmentsPie : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarDepartment';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'departments';
        plotsChart.functionAfterClickChart   = 'departments';
        plotsChart.functionClick = plotsChart.openUrlChart;
        plotsChart.getData(  );
        
        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal3' ).attr('active','');
    },
    initAdjudicationChart: function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarAdjudication';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'adjudication';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){plotsChart.adjudication = s; plotsChart.openUrl();} ;
        plotsChart.getData(  );

        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal4' ).attr('active','');
    },
    initFundingChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarFunding';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'funding';
        plotsChart.functionAfterClickChart   = '';
        plotsChart.functionClick = function(s){plotsChart.funding = s; plotsChart.openUrl();} ;
        plotsChart.getData(  );

        $('#buttonShowProviderTable').css('display','block');
        $('#botonShowInTable').css('display','none');

        $('.linkPlots').removeAttr("active"); $( '#plotTotal5' ).attr('active','');
    },
    initProvidersChart : function(){
        if( !plotsChart.allowGetData ){ return; }
        $('#waintingAnimation').css('display','block'); 
        plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

        plotsChart.chartType = 'stackedBarProvidersByAmount';
        plotsChart.typeHighChart = 'bar';
        plotsChart.groupChartBy = 'byAmount';
        plotsChart.domainChart  = 'providers';
        plotsChart.functionAfterClickChart = '';
        plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
        plotsChart.getData();
 
        $('#buttonShowProviderTable').css('display','block');
        //$('#botonShowChartBy').css('display','none');
        
        $('.linkPlots').removeAttr("active"); $( '#plotTotal6' ).attr('active','');
    },
    citiesAfterClick: {
        init: function( cityIdDB, typeChart ){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.city = cityIdDB;
            plotsChart.chartTitle.titleGral = citiesNL[cityIdDB];
            
            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.openChangeChart('stages');">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.openChangeChart('departments');">
                    <i class="fas fa-building" style="margin-right:10px;"></i> Dependencias
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.openChangeChart('providers');">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
            
            plotsChart.citiesAfterClick[typeChart]();
        },
        stages : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            plotsChart.domainChart  = 'stages';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData();
            
            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        departments : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarDepartment';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'departments';
            plotsChart.functionClick = function(s){plotsChart.department = s; plotsChart.openUrl();};
            plotsChart.getData();
            
            $('#buttonShowProviderTable').css('display','block');
            $('#botonShowInTable').css('display','none');

            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        providers : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'providers';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();};
            plotsChart.getData(  );
            
            $('#buttonShowProviderTable').css('display','block');
            //$('#botonShowInTable').css('display','none');

            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    departmentsAfterClick: {
        init: function( departmentIdDB, typeChart ){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.department = departmentIdDB;
            plotsChart.chartTitle.titleGral = departmentsObras[departmentIdDB];

            var strOptions = `
                <span class="linkPlots" id="plotTotal1" active onclick="plotsChart.openChangeChart('stages');">
                    <i class="fas fa-chart-line" style="margin-right:10px;"></i> Estatus
                </span>
                <span class="linkPlots" id="plotTotal2" onclick="plotsChart.openChangeChart('cities');">
                    <i class="fas fa-map" style="margin-right:10px;"></i> Municipios
                </span>
                <span class="linkPlots" id="plotTotal3" onclick="plotsChart.openChangeChart('providers');">
                    <i class="fas fa-user-tie" style="margin-right:10px;"></i> Contratistas
                </span>
            `;
            
            $('#radioSelects').html(strOptions);
            
            plotsChart.departmentsAfterClick[typeChart]();
        },
        stages : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'pieStatus';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            plotsChart.domainChart  = 'stages';
            plotsChart.functionClick = function(s){plotsChart.check_stage = s; plotsChart.openUrl();};
            plotsChart.getData();

            $('.linkPlots').removeAttr("active");$('#plotTotal1').attr('active','');
        },
        cities : function(){ 
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'barCities';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'cities';
            plotsChart.functionClick = function(s){plotsChart.city = s; plotsChart.openUrl();} ;
            plotsChart.getData();

            $('#buttonShowProviderTable').css('display','block');
            $('#botonShowInTable').css('display','none');
            
            $('.linkPlots').removeAttr("active");$('#plotTotal2').attr('active','');
        },
        providers : function(){
            //if( !plotsChart.allowGetData ){ return; }
            plotsChart.allowGetData = false; $('.linkPlots').css('cursor','wait');

            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byAmount';
            plotsChart.domainChart  = 'providers';
            plotsChart.functionClick = function(s){plotsChart.provider = s; plotsChart.openUrl();} ;
            plotsChart.getData( );
            
            $('#buttonShowProviderTable').css('display','block');
            //$('#botonShowChartBy').css('display','none');
        
            //$('#buttonShowProviderTable').css('display','block')
            $('.linkPlots').removeAttr("active");$('#plotTotal3').attr('active','');
        }
    },
    openUrlChart: function( idFieldInDB ){
        var functionAfterClickChart  = this.functionAfterClickChart;
        var value    = idFieldInDB;
        var domain   = '&domain=stages';
        var url      = 'graphics?chart='+functionAfterClickChart + '&value=' + value + domain;
        window.open( url ,"_self");
    },
    openChangeChart: function( typeDomain ){
        var queryStringParams = new URLSearchParams(window.location.search);
        var value         = urlParams.get('value');
        var chart        = urlParams.get('chart');
        var url      = 'graphics?chart='+ chart + '&value=' + value + '&domain=' + typeDomain;
        window.open( url ,"_self");
    },
    openUrl: function(){
        var urlLink = $('#urlLink').val();

        var queryString = '?';
        
        queryString += plotsChart.department     ? ('&department='    + plotsChart.department    ) : '';
        queryString += plotsChart.check_stage    ? ('&status='        + plotsChart.check_stage   ) : '';
        queryString += plotsChart.city           ? ('&city='          + plotsChart.city          ) : '';
        queryString += plotsChart.startDate      ? ('&startDate='     + plotsChart.startDate     ) : '';
        queryString += plotsChart.endDate        ? ('&endDate='       + plotsChart.endDate       ) : '';
        queryString += plotsChart.provider       ? ('&provider='      + plotsChart.provider      ) : '';
        queryString += plotsChart.funding        ? ('&funding='       + plotsChart.funding       ) : '';
        queryString += plotsChart.program        ? ('&program='       + plotsChart.program       ) : '';
        queryString += plotsChart.adjudication   ? ('&adjudication='  + plotsChart.adjudication  ) : '';
        queryString += plotsChart.countProjClick ? ('&countProjects=' + plotsChart.countProjClick) : '';
        
        if( plotsChart.seriesVisibles ){
            queryString += '&stages_selected=' + plotsChart.seriesVisibles;
            //localStorage.setItem("stages", plotsChart.seriesVisibles);
        }
        
        var url = urlLink + queryString ;
        
        window.open( url ,"_self");
    },
    showByProjectsOrAmount: function(thisSelect){
        
        $('#tableOfProviders').css('display','none') ;
        $('#genl-pie-chart').css('display','block') ;
        document.getElementById('waintingAnimation').style.display = 'block';


        
        var thisObjetSelect = $(thisSelect);
        var graphicIsShowBy = plotsChart.groupChartBy ;

        if( graphicIsShowBy == 'byAmount' ){
            plotsChart.chartType = 'stackedBarProvider';
            plotsChart.typeHighChart = 'bar';
            plotsChart.groupChartBy = 'byProjects';
            var values = setJsonsHC[plotsChart.domainChart]['byProjects']( plotsChart.data );
            thisObjetSelect.html('<i class="fas fa-stream"></i> Graficar por Monto')
        }else{
            var values = setJsonsHC[plotsChart.domainChart]['byAmount']( plotsChart.data );
            plotsChart.groupChartBy = 'byAmount';
            thisObjetSelect.html('<i class="fas fa-stream"></i> Graficar por Obras')
            plotsChart.chartType = 'stackedBarProvidersByAmount';
            plotsChart.typeHighChart = 'bar';
        }


        var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
        var extraSpaceWhenWindowSmall = $('.portlet-body').width() <= 712 ? 50 : 0;
        var heightChart = values[0][0].data.length*30 + 200 + extraSpaceWhenWindowSmall;

        setTimeout(function(){  
            $('#genl-pie-chart').css('height', heightChart + 'px');
            plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
            plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
            
            plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none'); 
        }, 100);
        
 
          
    },
    showOnlyInProcess: function(thisSelect){

        var thisObjetSelect = $(thisSelect);
        var isShowIn = thisObjetSelect.attr('isShowIn');

        if(isShowIn == 'all'){
            plotsChart.chart.series[6].setVisible(false,false);
            thisObjetSelect.attr('isShowIn','process');
            thisObjetSelect.html('Mostrar Todas');
        }else{
            $(plotsChart.chart.series).each(function(){
                this.setVisible(true, false);
            });
            thisObjetSelect.attr('isShowIn','all');
            thisObjetSelect.html('Mostrar en Proceso');
        }
        plotsChart.chart.redraw();
    },
    chart : '',
    data  : undefined,
    getData: function() {
        
        document.getElementById('waintingAnimation').style.display = "block";
        
        var dataUrl = {
            'department'    : plotsChart.department.toString(),
            'city'          : plotsChart.city.toString(),
            'check_stage'   : plotsChart.check_stage.toString(),
            'startDate'     : plotsChart.startDate.toString(),
            'endDate'       : plotsChart.endDate.toString(),
            'provider'      : plotsChart.provider.toString(),
            'adjudication'  : plotsChart.adjudication.toString(),
            'funding'       : plotsChart.funding.toString(),
            'program'       : plotsChart.program.toString(),
        }
        
        var empty_follow_ups = '?empty_follow_ups=0'
        var limit        = '&limit=1000000'
        var department   = dataUrl['department']   != '' ? '&department='          + dataUrl['department']   : ''
        var check_stage  = dataUrl['check_stage']  != '' ? '&check_stage='         + dataUrl['check_stage']  : ''
        var city         = dataUrl['city']         != '' ? '&city='                + dataUrl['city']         : ''
        var startDate    = dataUrl['startDate']    != '' ? '&contract_start_date=' + dataUrl['startDate']    : ''
        var endDate      = dataUrl['endDate']      != '' ? '&contract_end_date='   + dataUrl['endDate']      : ''
        var provider     = dataUrl['provider']     != '' ? '&provider='            + dataUrl['provider']     : ''
        var funding      = dataUrl['funding']      != '' ? '&funding='             + dataUrl['funding']      : ''
        var program      = dataUrl['program']      != '' ? '&program='             + dataUrl['program']      : ''
        var adjudication = dataUrl['adjudication'] != '' ? '&adjudication='        + dataUrl['adjudication'] : ''
        
        var queryStr = 'projects/with_follow_up' + empty_follow_ups + limit + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        
        var url = '/graphics?' + queryStr;
        
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                
                plotsChart.data = res.data;
                //console.log(res.data);
                if( plotsChart.chartType == 'pieStatus' ){
                    var values = setJsonsHC.Chart(res.data);
                    var options = plotsChart.optionsChart(values)
                    $('#genl-pie-chart').css('height','400px');
                    plotsChart.chart = Highcharts.chart('genl-pie-chart', options);
                    
                    plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');

                    return '';

                }else {
                    var values = setJsonsHC[plotsChart.domainChart][plotsChart.groupChartBy](res.data, plotsChart.yearRange);
                }
                
                var optionsHighChart = plotsChart.optionsStackedBar(values[0], values[1], values[2]);
                var extraSpaceWhenWindowSmall = $('.portlet-body').width() <= 712 ? 50 : 0;
                var columnHeight = plotsChart.typeHighChart == 'column' ? 130 : 0;
                var heightChart = values[0][0].data.length*30 + 230 + extraSpaceWhenWindowSmall + columnHeight ;
                $('#genl-pie-chart').css('height', heightChart + 'px');
                plotsChart.chart = Highcharts.chart('genl-pie-chart', optionsHighChart);
                plotsChart.chart.render();  //Renderiza para mostrar los labels que se generan despues de crearse la grafica
                
                plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');

            },

            data:  JSON.stringify ({'department'    : plotsChart.department.toString(),
                                    'city'          : plotsChart.city.toString(),
                                    'check_stage'   : plotsChart.check_stage.toString(),
                                    'startDate'     : plotsChart.startDate.toString(),
                                    'endDate'       : plotsChart.endDate.toString(),
                                    'provider'      : plotsChart.provider.toString(),
                                    'adjudication'  : plotsChart.adjudication.toString(),
                                    'funding'       : plotsChart.funding.toString(),
                                    'program'       : plotsChart.program.toString(),
                                   })

        }).done(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        }).fail(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        }).always(function() { plotsChart.allowGetData = true; $('.linkPlots').css('cursor','pointer'); $('#waintingAnimation').css('display','none');
        });

    },
    optionsChart : function(data){

        var widthWindow = $('.portlet-body').width();

        if(widthWindow <= 712){
            var chartDataLabel = false;                
            var chartShowInLegend = true;
        }else{
            var chartDataLabel = true;
            var chartShowInLegend = true;
        }
        
        var titleTextPev = 'TOTAL DE OBRAS ';

        var options = {
   	        chart: {
   	    	    type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var allStatus = plotsChart.chart.series[0].data;
                                var countAmount = 0;
                                for( var s in allStatus ){
                                    if( allStatus[s].visible ){
                                        countAmount += allStatus[s].amount;
                                    }
                                }
                                var totalProjectsVisible = plotsChart.chart.series[0].total;
                                plotsChart.chartTitle.obras  = totalProjectsVisible;
                                plotsChart.chartTitle.amount = countAmount;
                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
   	    	},
   	    	title: {
   	            text: plotsChart.chartTitle.setTitle(),
                useHTML: true
   	    	},
   	    	tooltip: {
   	            pointFormat: '<b>{point.percentage:.1f} %</b>'
   	    	},
   	    	plotOptions: {
   	    	    pie: {
   	    		    allowPointSelect: true,
   	    		    cursor: 'pointer',
                    depth: 35,
                    showInLegend: chartShowInLegend,
   	                point: {
   	                    events: {
   	                        click: function () {
                                plotsChart.countProjClick = this.y;
                                plotsChart.functionClick( this.x );
   	                        }/*,
                            legendItemClick: function(){
                                console.log(this.series.total);                                
                            }*/
   	                    }
   	                },									    
   	    		    dataLabels: {
   	    		        enabled: chartDataLabel,
   	    		        color: '#000000',
   	    		        connectorColor: '#000000',
   	    		        //format: 
                        formatter: function(){
                            var point = this.point;
                            var amount = this.point.amount;
                            
                            var sfcat = parseInt(amount/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                            return '<b>' + point.y + ' ' + point.name + ' <span style="color:#446;">$' + sfcat + ' K</span>';
                        }
   	                }
   	    	    }
   	        },
            legend: {
                useHTML: true,
                labelFormatter: function () {
                    var a = this.percentage
                    var styleText = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px;"  '
                    var styleTextS = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 0px; font-weight:600;"  '
                    var styleTextN = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px; font-weight:bold;"  '
                    var nameO = '<span '+ styleTextS +'>' + this.name + '</span>  '
                    var yValue = this.y === null ? 0 : this.y;
                    var pYO = '<span '+ styleTextN +'>' + yValue + '</span> '

                    var decimals = 0;
                    if( (this.percentage*100)%100 == 0 ){ decimals=0; }else if( (this.percentage*10)%10 == 1 ){ decimals=1; }else{decimals=2}

                    var percentO = '<span '+ styleText +'>' + this.percentage.toFixed(decimals) + '%</span>  '

                    if( yValue === 0 ){
                        this.options.color = "#777"
                        this.legendGroup.element.style.display = "none"
                        return null;
                    }
                    
                    var re = this.y === null ? null : percentO + nameO + ': ' + pYO ;
                    return re;
                }
            },
            credits: {
                enabled: false
            },		
   	    	series: [{
   	    	    data: data
   	    	}]
   	    };
        
        return options;
    },
    optionsStackedBar: function(data, categories, amountsByCity ) {

        var preffixTooltip = plotsChart.groupChartBy == 'byAmount' ? '$' : '';
        var titleXAxis     = plotsChart.groupChartBy == 'byAmount' ? 'Montos' : 'Número de Obras';
        var labelsPositionsX = plotsChart.typeHighChart == 'bar' ? 5  : undefined;
        var labelsPositionsY = plotsChart.typeHighChart == 'bar' ? 10 : -20;
        var alignLabel       = plotsChart.typeHighChart == 'bar' ? 'right' : 'center';
        var paddingRightChart= plotsChart.typeHighChart == 'bar' ? 68 : 0;
        var groupPaddingColumn = $('.portlet-body').width() <= 712 ? 0.13 : 0.2;

        var options = {
            chart: {
                type: plotsChart.typeHighChart,
                spacingRight: paddingRightChart,
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var series = this.series;
                                
                                var countAmount = 0;
                                var countObras  = 0;
                                
                                for( var s in series ){
                                    var serie = series[s];
                                    if( serie.visible ){
                                        var cities = serie.data;
                                        for( var c in cities ){
                                            countAmount += cities[c].amount;
                                            countObras += cities[c].y;
                                        }
                                    }
                                }
                                
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    plotsChart.chartTitle.obras  = countAmount;
                                    plotsChart.chartTitle.amount = countObras;
                                }else{
                                    plotsChart.chartTitle.obras  = totalProjectsVisible;
                                    plotsChart.chartTitle.amount = countAmount;
                                }

                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
            },
            title: {
                text: plotsChart.chartTitle.setTitle()
            },
   	    	tooltip: {
                valueDecimals: 0,
                valuePrefix: preffixTooltip,
   	    	},
            xAxis: {
                categories: categories,
                labels: {
                    step: 1
                }
            },
            yAxis: {
                maxPadding: 0.1,
                stackLabels: {
                    enabled: true,
                    align: alignLabel,
                    allowOverlap: true,
                    style: {
                        color: '#226',
                        fontWeight: 'bold'
                    },
                    x: labelsPositionsX,
                    y: labelsPositionsY,
                    verticalAlign: 'top',
                    amountsByCity : amountsByCity,
                    formatter: function () {
                        var series = this.axis.series; //status
                        var thisCity = this.x;
                        var sumAmountThisCity = 0;
                        for( var s in series ){ //Son 7
                            if(series[s].data.length){
                                if(series[s].visible){
                                    sumAmountThisCity += series[s].data[thisCity].amount;
                                }
                            }
                        }
                        if(sumAmountThisCity == 0){return '';}

                        if( plotsChart.groupChartBy == 'byAmount' ){
                            var totalY = parseInt(this.total/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            totalY = '$' + totalY + ' K';
                            var amount = sumAmountThisCity;
                            amount = amount + ' Obras '
                        }else{
                            var totalY = this.total ;
                            totalY = totalY + ' Obras ' ;
                            var amount = parseInt(sumAmountThisCity/1000).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            amount = '$' + amount + ' K';
                        }
                        return '<span style="color:#000;font-weight:700;">'+ totalY + '</span><br><span style="color:#336;margin-left:13px;font-weight:100;">'+ amount +'</span>';
                    }
                },
                title:{
                    text: '<span style="color:#000; font-weight: 700;">' + titleXAxis + '</span>'
                },
                labels: {
                    rotation: 0,
                    autoRotation: 0,
                    autoRotationLimit: 0,
                    formatter: function () {
                        var val = this.value
                        if( val > 1000000){
                            var newVal = val / 1000000;
                            val = newVal + ' M'
                        }
                        return val;
                    }
                }
            },
            legend: {
                reversed: true
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                column: {
                    groupPadding: groupPaddingColumn,
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }
                                
                                var ser = plotsChart.chart.series;
                                var idSeriesVisibles = '';
                                //var idSeriesVisibles = [];
                                for(var s in ser){
                                	if( ser[s].visible ){
                                        var idSerie =  Math.abs(parseInt(s) - 7) ;
                                        idSeriesVisibles += idSerie + ',';
                                        //idSeriesVisibles.push( Math.abs(parseInt(s) - 7) );
                                    }
                                }

                                plotsChart.seriesVisibles = idSeriesVisibles;
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.category );
   	                        }
   	                    }
   	                }
                },
                bar: {
                    groupPadding:0,
                    //pointWidth:10
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }

                                var ser = plotsChart.chart.series;
                                var idSeriesVisibles = '';
                                //var idSeriesVisibles = [];
                                for(var s in ser){
                                	if( ser[s].visible ){
                                        var idSerie =  Math.abs(parseInt(s) - 7) ;
                                        idSeriesVisibles += idSerie + ',';
                                        //idSeriesVisibles.push( Math.abs(parseInt(s) - 7) );
                                    }
                                }

                                plotsChart.seriesVisibles = idSeriesVisibles;
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.idFieldDB );
   	                        }
   	                    }
   	                }
                }
            },
            credits: {
                enabled: false
            },
            series: data
        }
        
        return options;
    },
    search: function(){
        this.department   = $('#departmentSearch').val();
        this.check_stage  = $('#check_stage').val();
        this.city         = $('#city').val();
        this.startDate    = $('#startDate').val();
        this.endDate      = $('#endDate').val();
        this.provider     = $('#provider').val();
        this.funding      = $('#funding').val();
        this.program      = $('#program').val();
        this.adjudication = $('#adjudication').val();

        $('#modalSearch').modal('hide');

        plotsChart.getData();

    }
    ,organos: function(){
        
        $('#sidebar').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('.portlet-header').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('#radioSelects').remove()
        $('.portlet-body .row')[0].remove()
        $('#genl-pie-chart').css('height', 1000);

        Highcharts.chart('genl-pie-chart', {
            chart: {
                type: 'bar',
            },
            title: {
                text: 'Base 3 organos'
            },
            subtitle: {
                text: '<span style="color:#333;font-weight:bold;">$17545 k </span> <span style="color:#339;font-weight:bold;">OBS 502 </span>'
            },
            xAxis: {
                categories: ['Secretaría de Finanzas y Tesorería General del Estado','Secretaría de Educación','Secretaría de Infraestructura','Secretaría de General de Gobierno','Secretaría de Administración','Secretaría de Desarrollo Social','Procuraduría General de Justicia','Secretaría de Salud','Secretaría de Seguridad Pública','Secretaría de Desarrollo Agropecuario','Secretaría Economía y Trabajo'],
                crosshair: true
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 40,
                y: 10,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
                shadow: true
            },
            yAxis: {
                min: 0,
                maxPadding: 0.3,
                title: {
                    text: 'Rainfall (mm)'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function(){
                            var val = parseInt(this.y).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                            var series = this.series; //status
                            var thisCity = this.x;
                            var sumAmountThisCity = this.y;
                            
                            //if(sumAmountThisCity == 0){return '';}
                            
                            var totalY = parseInt(this.y).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            totalY = '$' + totalY + ' K';
                            var amount = this.point.y2;
                            amount = amount + ' OBS '
                            return '<span style="color:#000;font-weight:700;">'+ totalY + '</span><span style="color:#336;margin-left:13px;font-weight:100;"> '+ amount +'</span>';
                            
                        }
                    }
                }
            },
            series: [{
                data: [{ y: 1638297, y2: 31, },{ y: 1028347, y2: 33 , },{ y: 161230, y2: 32, },{ y: 231423, y2: 9, },{ y: 112, y2: 1, },{ y: 5137, y2: 1, },{ y: 0, y2: 0, },{ y: 0, y2: 0, },{ y: 0, y2: 0, },{ y: 0, y2: 0, },{ y: 0 , y2: 0, }],
                name: 'ASF',
                color: '#009',
            }, {
                data: [{ y: 2544729, y2: 113, },{ y: 45857, y2: 3, },{ y: 766027, y2: 43, },{ y: 0, y2: 0, },{ y: 0, y2: 1, },{ y: 0, y2: 0, },{ y: 0, y2: 0, },{ y: 0, y2: 0, },{ y: 0, y2: 2, },{ y: 0, y2: 2, },{ y: 0, y2: 0, } ],
                name: 'SFP',
                color: '#090',
            }, {
                data: [{ y: 10500963, y2: 124, },{ y: 334000, y2: 24, },{ y: 176794, y2: 54, },{ y: 0, y2: 0, },{ y: 76717, y2: 16, },{ y: 33051, y2: 6, },{ y: 2838, y2: 1, },{ y: 291, y2: 1, },{ y: 0, y2: 1, },{ y: 0, y2: 0, },{ y: 0, y2: 4, } ] ,
                name: 'ASENL',
                color: '#900',
            
            }]
        });
    },
    pieorg: function(){
        
        $('#sidebar').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('.portlet-header').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('#radioSelects').remove()
        $('.portlet-body .row')[0].remove()
        $('#genl-pie-chart').css('height', 500);

        Highcharts.chart('genl-pie-chart', {
            chart: {
   	    	    type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var allStatus = plotsChart.chart.series[0].data;
                                var countAmount = 0;
                                for( var s in allStatus ){
                                    if( allStatus[s].visible ){
                                        countAmount += allStatus[s].amount;
                                    }
                                }
                                var totalProjectsVisible = plotsChart.chart.series[0].total;
                                plotsChart.chartTitle.obras  = totalProjectsVisible;
                                plotsChart.chartTitle.amount = countAmount;
                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
   	    	},
   	    	title: {
   	            text: 'TOTAL 473 PRA',
                useHTML: true
   	    	},
   	    	tooltip: {
   	            pointFormat: '<b>{point.percentage:.1f} %</b>'
   	    	},
   	    	plotOptions: {
   	    	    pie: {
   	    		    allowPointSelect: true,
   	    		    cursor: 'pointer',
                    depth: 35,
                    showInLegend: true,
   	                point: {
   	                    events: {
   	                        click: function () {
                                plotsChart.countProjClick = this.y;
                                plotsChart.functionClick( this.x );
   	                        }/*,
                            legendItemClick: function(){
                                console.log(this.series.total);                                
                            }*/
   	                    }
   	                },									    
   	    		    dataLabels: {
   	    		        enabled: true,
   	    		        color: '#224',
   	    		        connectorColor: '#000000',
                        formatter: function(){
                            var point = this.point;

                            return '<b>' + point.name + ':  </b><span style="font-weight:100;">' + point.y + ' PRA</span>' ;
                        }
   	                }
   	    	    }
   	        },
            legend: {
                useHTML: true,
                labelFormatter: function () {
                    var a = this.percentage
                    var styleText = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px;"  '
                    var styleTextS = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 0px; font-weight:600;"  '
                    var styleTextN = ' style="font-family: \'Poppins\', sans-serif; font-weight: 400; margin: 2px 2px; font-weight:bold;"  '
                    var nameO = '<span '+ styleTextS +'>' + this.name + '</span>  '
                    var yValue = this.y === null ? 0 : this.y;
                    var pYO = '<span '+ styleTextN +'>' + yValue + '</span> '

                    var decimals = 0;
                    if( (this.percentage*100)%100 == 0 ){ decimals=0; }else if( (this.percentage*10)%10 == 1 ){ decimals=1; }else{decimals=2}

                    var percentO = '<span '+ styleText +'>' + this.percentage.toFixed(decimals) + '%</span>  '

                    if( yValue === 0 ){
                        this.options.color = "#777"
                        this.legendGroup.element.style.display = "none"
                        return null;
                    }
                    
                    var re = this.y === null ? null : nameO + ': ' + pYO + percentO ;
                    return re;
                }
            },
            credits: {
                enabled: false
            },		
            series: [{
                data: [{ y: 279, name: 'ASF'},{ y: 30, name: 'ASE', color: '#942585'  },{ y: 164, name: 'SFP',  }],
                name: 'ASF',
                color: '#009',
            }]
        });
    },
    anios: function(){
        
        $('#sidebar').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('.portlet-header').remove()
        $('#title-breadcrumb-option-demo').remove()
        $('#radioSelects').remove()
        $('.portlet-body .row')[0].remove()
        $('#genl-pie-chart').css('height', 570);

        plotsChart.chart = Highcharts.chart('genl-pie-chart', {
            chart: {
                type: 'column',
                spacingRight: 10,
                events: {
                    render: function () {    //Cuando se ocultan una rebanada o barra se actualizan las cantidades del titulo
                        try{
                            if( plotsChart.chart ){
                                var series = this.series;
                                
                                var countAmount = 0;
                                var countObras  = 0;
                                
                                for( var s in series ){
                                    var serie = series[s];
                                    if( serie.visible ){
                                        var cities = serie.data;
                                        for( var c in cities ){
                                            countAmount += cities[c].amount;
                                            countObras += cities[c].y;
                                        }
                                    }
                                }
                                
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    plotsChart.chartTitle.obras  = countAmount;
                                    plotsChart.chartTitle.amount = countObras;
                                }else{
                                    plotsChart.chartTitle.obras  = totalProjectsVisible;
                                    plotsChart.chartTitle.amount = countAmount;
                                }

                                plotsChart.chart.setTitle({ text: plotsChart.chartTitle.setTitle() } )
                            }
                        }
                        catch(e){
                            ;
                        }
                    }
                }
            },
            title: {
                text: 'TOTAL 473 PRA'
            },
   	    	tooltip: {
                valueDecimals: 0,
                valuePrefix: ' PRA',
   	    	},
            xAxis: {
                categories: [ '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', ],
                labels: {
                    step: 1
                }
            },
            yAxis: {
                maxPadding: 0.1,
                stackLabels: {
                    enabled: true,
                    align: 'center',
                    allowOverlap: true,
                    style: {
                        color: '#226',
                        fontWeight: 'bold'
                    },
                    x: 0,
                    y: -5,
                    verticalAlign: 'top',
                    formatter: function () {
                        var series = this.axis.series; //status
                        var thisCity = this.x;
                        return '<span style="color:#000;font-weight:700;">'+ this.total + ' PRA</span>';
                    }
                },
                title:{
                    text: '<span style="color:#000; font-weight: 700;"> PRA </span>'
                },
                labels: {
                    rotation: 0,
                    autoRotation: 0,
                    autoRotationLimit: 0,
                    formatter: function () {
                        var val = this.value
                        if( val > 1000000){
                            var newVal = val / 1000000;
                            val = newVal + ' M'
                        }
                        return val;
                    }
                }
            },
            legend: {
                reversed: false
            },
            plotOptions: {
                series: {
                    stacking: 'normal'
                },
                column: {
                    groupPadding: 0,
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }
                                
                                var ser = plotsChart.chart.series;
                                var idSeriesVisibles = '';
                                //var idSeriesVisibles = [];
                                for(var s in ser){
                                	if( ser[s].visible ){
                                        var idSerie =  Math.abs(parseInt(s) - 7) ;
                                        idSeriesVisibles += idSerie + ',';
                                        //idSeriesVisibles.push( Math.abs(parseInt(s) - 7) );
                                    }
                                }

                                plotsChart.seriesVisibles = idSeriesVisibles;
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.category );
   	                        }
   	                    }
   	                }
                },
                bar: {
                    groupPadding:0,
                    //pointWidth:10
                    point: {
   	                    events: {
   	                        click: function () {
                                if( plotsChart.groupChartBy == 'byAmount' ){
                                    var series = plotsChart.chart.series; //status
                                    var thisX = this.x;
                                    var sumAmounts = 0;
                                    for( var s in series ){ //Son 7
                                        if(series[s].data.length){
                                            if(series[s].visible){
                                                sumAmounts += series[s].data[thisX].amount;
                                            }
                                        }
                                    }
                                }else{
                                    var sumAmounts = this.total;
                                }

                                var ser = plotsChart.chart.series;
                                var idSeriesVisibles = '';
                                //var idSeriesVisibles = [];
                                for(var s in ser){
                                	if( ser[s].visible ){
                                        var idSerie =  Math.abs(parseInt(s) - 7) ;
                                        idSeriesVisibles += idSerie + ',';
                                        //idSeriesVisibles.push( Math.abs(parseInt(s) - 7) );
                                    }
                                }

                                plotsChart.seriesVisibles = idSeriesVisibles;
                                plotsChart.countProjClick = sumAmounts;
                                plotsChart.functionClick( this.idFieldDB );
   	                        }
   	                    }
   	                }
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                data: [ 0   , 0   , 0   , 0   , 0   , 0   , 0   , 30, 0   , ],
                name: 'ASE',
                color: '#009',
            }, {
                data: [ 0    , 0    , 27   , 41   , 30   , 66   , 50   , 59   , 6    , ],
                name: 'ASF',
                color: '#090',
            }, {
                data: [ 7 , 1 , 0 , 4 , 5 , 11, 38, 39, 59, ] ,
                name: 'SFP',
                color: '#900',
            
            }]
            
        });
        
        plotsChart.chart.render();
    },
    yearRange: {min: 0, max: 0},
    startDateChart: '',
    endDateChart: ''
}



function setState( chartType ){
    var state = {
        department   : plotsChart.department   ,
        check_stage  : plotsChart.check_stage  ,
        city         : plotsChart.city         ,
        startDate    : plotsChart.startDate    ,
        endDate      : plotsChart.endDate      ,
        provider     : plotsChart.provider     ,
        funding      : plotsChart.funding      ,
        program      : plotsChart.program      ,
        adjudication : plotsChart.adjudication ,
        chartType    : plotsChart.chartType    ,
    }

    window.history.pushState({ chartType: chartType, state}, null, '');
}


function navBarCharts( thisButton ){
}
