var Chart = React.createClass({displayName: 'Chart',
    render: function() {
        if (Object.getOwnPropertyNames(this.props.data).length > 0){
            return (
                React.createElement("div", {className: "event-card"},
                    React.createElement("span", {className: "event-name"}, this.props.data.name),
                    React.createElement("svg", {width: this.props.width, height: this.props.height},
                      this.props.children
                    ),
                    React.createElement("span", {className: "powered-by"}, React.createElement("i", {className: "fa-custom-knurling"}), " KNURLING.IO")
                )
            );
        } else {
            return (
                React.createElement("div", {className: "event-card"},
                    React.createElement("span", {className: "powered-by"}, React.createElement("i", {className: "fa-custom-knurling"}), " KNURLING.IO")
                )
            );
        }
    }
});

var Circle = React.createClass({displayName: 'Circle',
  getDefaultProps: function() {
    return {
      cx: 0,
      cy: 0,
      r: 0
    }
  },
  render: function(){
    return (
      React.createElement("circle", {cx: this.props.cx, cy: this.props.cy, r: this.props.r, stroke: this.props.colour, strokeWidth: "3", fill: this.props.colour})
    );
  }
});

var DataSeries = React.createClass({displayName: 'DataSeries',
    render: function(){
        var data=this.props.data;
        var select = this.props.select;
        if (select == "sinclair") { select = "normalized";}
        var dataset = [];
        var datasetM = [];
        var datasetF = [];
        var wSnatch = _.map(data, function(d, key){
            dataset.push([d.bodyweight, d[select]]);
            if(d.gender==1){
                datasetM.push([d.bodyweight, d[select]]);
            }else{
                datasetF.push([d.bodyweight, d[select]]);
            }
        });
        var w =this.props.width;
        var h = this.props.height;
        var padding = this.props.padding;

        var xScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[0]; })])
             .range([padding, w - padding * 2]);

        var yScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[1]; })])
             .range([h - padding, padding]);
        var rScale = d3.scale.linear()
             .domain([0, d3.max(dataset, function(d) { return d[1]; })])
             .range([2, 5]);
        //Define X axis
            var xAxis = d3.svg.axis()
                              .scale(xScale)
                              .orient("bottom")
                              .ticks(5);

            //Define Y axis
            var yAxis = d3.svg.axis()
                              .scale(yScale)
                              .orient("left")
                              .ticks(5);
        var fCircles = _.map(datasetF, function(d) {
          return (
            React.createElement(Circle, {cx: xScale(d[0]), cy: yScale(d[1]), r: "1", colour: "red"})
          )
        });
        var mCircles = _.map(datasetM, function(d) {
          return (
            React.createElement(Circle, {cx: xScale(d[0]), cy: yScale(d[1]), r: "1", colour: "blue"})
          )
        });
        return (
            React.createElement("g", null, mCircles, fCircles)
        );
    }
});

var EventChart = React.createClass({displayName: 'EventChart',
    getInitialState: function(){
        return {
            data: {}
        }
    },
    componentDidMount: function(){
        this.loadData(this.props.eventId);
    },
    loadData: function (eventId){
        var context=this;
        var url='http://api.knurling.io/events/'.concat(eventId);
        $.ajax({
            url: url,
            dataType: 'json',
            success: function(data){
                context.setState({
                    data: data
                });
            },
            error: function(){
              console.log('Error making API request.');
            }
        });
    },
    render: function(){
        var chartTitle = "";
        var chartSubtitle = "";
        if (this.props.select == "sinclair") {
            chartTitle = "Total Sinclair (kg)";
            chartSubtitle = "Sinclair Visualization";
        } else if (this.props.select == "snatch") {
            chartTitle = "Best Snatch (kg)";
            chartSubtitle = "Snatch Visualization";
        } else if (this.props.select == "clean_jerk") {
            chartTitle = "Best Clean & Jerk (kg)";
            chartSubtitle = "Clean & Jerk Visualization";
        }
        return (
            React.createElement(Chart, {data: this.state.data, width: this.props.width, height: this.props.height},
                React.createElement("text", {x: "-240", y: "40", fill: "black", transform: "rotate(270)"}, chartTitle),
                React.createElement("text", {x: "60", y: "290", fill: "black"}, "Bodyweight (kg)"),
                React.createElement("text", {x: "10", y: "15", fill: "black"}, chartSubtitle),
                React.createElement("text", {x: "10", y: "45", fill: "red"}, "• Female Results"),
                React.createElement("text", {x: "10", y: "65", fill: "blue"}, "• Male Results"),
                React.createElement(DataSeries, {data: this.state.data.results, select: this.props.select, width: this.props.width, height: this.props.height, padding: this.props.padding})
            )
        );
    }
});
if (document.getElementById('chart-mobile')){
React.render(React.createElement(EventChart, {width: "300", height: "300", padding: "30", eventId: "1", select: "sinclair"}), document.getElementById("chart-mobile"));
React.render(React.createElement(EventChart, {width: "700", height: "300", padding: "30", eventId: "1", select: "sinclair"}), document.getElementById("chart-full"));
}
