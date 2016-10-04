angular.module('starter.controllers', [])

.controller('NoPressureCtrl', function($scope) {

  function getWidthHeight(element) {
    var node = element.node();
    return {
      width: node.offsetWidth,
      height: node.offsetHeight
    };
  }
  var container = '.svg-container';

  var whObj = getWidthHeight(d3.select(container));
  var width = whObj.width,
      height = whObj.height;

  var svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  var r = Math.min(width, height) ;

  var circles = svg.selectAll("circle")
    .data([r, r], function(d) { return d; });

  circles.enter().append("circle")
    .attr("class", "circle")
    .attr("cy", function(d) { return height / 2 ; })
    .attr("cx", function(d) { return width/2 ; })
    .attr("r", function(d) {return d/5;})
    .on("click", function() {
      svg.selectAll('.circle').each(pulse);
      return true;
    });

  function pulse(d, i) {
    var circleIndex = i;
    d3.select(this).transition()
      .duration(2000)
      .attr("r", 1)
      .transition()
      .duration(2000)
      .attr("r", function(d) {return d/5;})
      .attr("cx", function(d) {
        if (circleIndex%2 === 0 ) {
          return width/2 - (d/5);
        }
        return width/2 + (d/5);
      });
  }
  circles.exit().remove();

})

.controller('WithPressureCtrl', function($scope) {

  function getWidthHeight(element) {
    var node = element.node();
    return {
      width: node.offsetWidth,
      height: node.offsetHeight
    };
  }
  var container = '.svg-container-with-pressure';

  var whObj = getWidthHeight(d3.select(container));
  var width = whObj.width,
      height = whObj.height;

  var svg = d3.select(container).append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');

  var r = Math.min(width, height) ;

  var circles = svg.selectAll("circle")
    .data([r, r], function(d) { return d; });

  circles.enter().append("circle")
    .attr("class", "circle")
    .attr("cy", function(d) { return height / 2 ; })
    .attr("cx", function(d) { return width/2 ; })
    .attr("r", function(d) {return d/5;});

  var highestForce = 0;

  Pressure.set('.svg-container-with-pressure', {
    change: function(force) {
      console.log(force);
      if (force > highestForce) {
        highestForce = force;
      }
    },
    end: function(){
      svg.selectAll('.circle').each(buildPulse(highestForce/(force||1)));
      highestForce = 0;
    },
    unsupported: function(){
      console.log("Unsupported");
      svg.selectAll('.circle').each(buildPulse(2000));
    }
  });

  function buildPulse(speed) {
    return function pulse(d, i) {
      var circleIndex = i;
      d3.select(this).transition()
        .duration(speed)
        .attr("r", 1)
        .transition()
        .duration(speed)
        .attr("r", function(d) {return d/5;})
        .attr("cx", function(d) {
          if (circleIndex%2 === 0 ) {
            return width/2 - (d/5);
          }
          return width/2 + (d/5);
        });
    }
  }
  circles.exit().remove();

});
