
/*
  The goal of this exercise is to take a polygon defined by the points 'points',
  use the mouse events to draw a line that will split the polygon and then draw
  the two split polygons. In the start, you'll have the initial polygon
  (start.png) While dragging the mouse, the polygon should be shown along with
  the line you're drawing (mouseMove.png) After letting go of the mouse, the
  polygon will be split into two along that line (mouseUp.png)

  The code provided here can be used as a starting point using
  plain-old-Javascript, but it's fine to provide a solution using
  react/angular/vue/etc if you prefer.
*/

// Split line element ID
const SPLITTER_ID = 'splitter';
// An array to hold the points of split line when drawing
let splitPoints = [];

/**
 * Check if the provided value `a` is between `b1` and `b2`
 *
 * @param {number} a - Value to be checked
 * @param {number} b1 - One of the bouding values
 * @param {number} b2 - One of the bouding values
 *
 * @return {boolean} true if it is between the bounding values otherwise false
 */
function isBetween(a, b1, b2) {
  if ((a >= b1) && (a <= b2)) {
    return true;
  }
  if ((a >= b2) && (a <= b1)) {
    return true;
  }
  return false;
}

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * Calculate the interection point between line 1 `l1` and line 2 `l2`
 * Based on https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
 *
 * @param {Point[]} l1 - Array of 2 points for line 1
 * @param {Point[]} l2 - Array of 2 points for line 2
 *
 * @return {(Point\|undefined)} - intersection point if intersected otherwise undefined
 */
function intersect(l1, l2) {
  const [sp1, ep1] = l1;
  const [sp2, ep2] = l2;
  const denominator = (sp1.x - ep1.x) * (sp2.y - ep2.y)
    - (sp1.y - ep1.y) * (sp2.x - ep2.x);

  // Not parallel or coincident
  if (denominator !== 0) {
    const pt = {
      x: (
        (sp1.x * ep1.y - sp1.y * ep1.x) * (sp2.x - ep2.x)
        - (sp1.x - ep1.x) * (sp2.x * ep2.y - sp2.y * ep2.x)
      ) / denominator,
      y: (
        (sp1.x * ep1.y - sp1.y * ep1.x) * (sp2.y - ep2.y)
        - (sp1.y - ep1.y) * (sp2.x * ep2.y - sp2.y * ep2.x)
      ) / denominator,
    };

    // Make sure the interection point is between two lines
    if (
      isBetween(pt.x, sp1.x, ep1.x)
      && isBetween(pt.y, sp1.y, ep1.y)
      && isBetween(pt.x, sp2.x, ep2.x)
      && isBetween(pt.y, sp2.y, ep2.y)
    ) {
      return pt;
    }
  }
  return undefined;
}

/**
 * Set the start point of split line
 *
 * @param {Point} point - Start point
 */
function setStartPoint(point) {
  splitPoints = [point];
}

/**
 * Set the end point of the split line
 *
 * @param {Point} point - End point
 */
function setEndPoint(point) {
  const [startPoint] = splitPoints;

  splitPoints = [startPoint, point];
}

/**
 * Remove the split line from SVG
 */
function clearSplitLine() {
  // Clean up
  const splitLine = document.getElementById(SPLITTER_ID);
  if (splitLine !== null) {
    splitLine.remove();
  }
}

/**
 * Draw the split line on the SVG
 */
function drawSplitLine(color = 'red') {
  clearSplitLine();

  if (splitPoints.length >= 2) {
    const svgEl = getSVG();
    const splitLine = createSVGPath(SPLITTER_ID);
    const path = [
      'M',
      splitPoints[0].x,
      splitPoints[0].y,
      'L',
      splitPoints[1].x,
      splitPoints[1].y,
      'Z',
    ].join(' ');
    splitLine.setAttribute('d', path);
    splitLine.setAttribute('stroke', color);
    svgEl.appendChild(splitLine);
  }
}

/**
 * Get the SVG element
 *
 * @return {(SVGElement\|undefined)}
 */
function getSVG() {
  const svgs = document.getElementsByTagName('svg');
  if (svgs.length > 0) {
    // Get the first 1
    return svgs[0];
  }
  return undefined;
}

/**
 * Create a SVG path with provided ID
 *
 * @param {string} id - ID attribute for the SVG path element;
 *
 * @return {SVGPathElement}
 */
function createSVGPath(id) {
  const svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  svgPath.setAttribute('id', id);
  return svgPath;
}

/**
 * Convert UIEvent coordinates to SVGPoint
 *
 * @param {UIEvent} event
 *
 * @return {(SVGPoint\|undefined)}
 */
function getSVGPointFrom(event) {
  const svgEl = getSVG();
  if (svgEl) {
    const { clientX, clientY } = event;
    const pt = svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const screenCTM = svgEl.getScreenCTM();
    if (screenCTM !== null) {
      return pt.matrixTransform(screenCTM.inverse());
    }
  }
  return undefined;
}

function onMouseDown(event) {
  const startPoint = getSVGPointFrom(event);
  // Capture the start point for the split line
  setStartPoint(startPoint);
}

function onMouseMove(event) {
  // Update the end point of the split line and draw the line
  // Only draw the line when it has enough points
  if (splitPoints.length > 0) {
    const movingPoint = getSVGPointFrom(event);
    setEndPoint(movingPoint);
    drawSplitLine();
  }
}

function onMouseUp(event) {
  // It is not necessary to show the split line at this stage
  clearSplitLine();
  // Prepare the split line for testing against line intersections
  const endPoint = getSVGPointFrom(event);
  const [startPoint] = splitPoints;
  const l2 = [startPoint, endPoint];
  splitPoints = [];

  const poly1 = [];
  const poly2 = [];
  let intersected = false;

  // Generate the two sets of points for the split polygons
  points.forEach((pt, idx, pts) => {
    const nextPointIndex = (idx + 1) % pts.length;
    const interception = intersect([pt, pts[nextPointIndex]], l2);

    intersected ? poly2.push(pt) : poly1.push(pt);

    if (interception) {
      intersected = !intersected;
      poly1.push(interception);
      poly2.push(interception);
    }
  });

  // Only update the polygon when there are 2 interceptions
  // and both new polygons having enough points
  if (!intersected && poly1.length >= 2 && poly2.length >= 2) {
    clearPoly();
    addPoly(poly1, 'blue');
    addPoly(poly2, 'green');
  }
}

/*
	Code below this line shouldn't need to be changed
*/

// Draws a polygon from the given points and sets a stroke with the specified
// color
function addPoly(points, color = 'black') {
  if(points.length < 2) {
    console.error("Not enough points");
    return;
  }

  const content = document.getElementById('content');

  var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  var svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  let path = 'M' + points[0].x + ' ' + points[0].y

  for(const point of points) {
      path += ' L' + point.x + ' ' + point.y;
  }
  path += " Z";
  svgPath.setAttribute('d', path);
  svgPath.setAttribute('stroke', color);

  svgElement.setAttribute('height', "500"); 
  svgElement.setAttribute('width', "500");
  svgElement.setAttribute('style', 'position: absolute;');
  svgElement.setAttribute('fill', 'transparent');

  svgElement.appendChild(svgPath);
  content.appendChild(svgElement);
}

// Clears the all the drawn polygons
function clearPoly() {
  const content = document.getElementById('content');
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

// Sets the mouse events needed for the exercise
function setup() {
  this.clearPoly();
  this.addPoly(points);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
}

const points = [
  { x : 100, y: 100 },
  { x : 200, y: 50 },
  { x : 300, y: 50 },
  { x : 400, y: 200 },
  { x : 350, y: 250 },
  { x : 200, y: 300 },
  { x : 150, y: 300 },
]

window.onload = () => setup()




























