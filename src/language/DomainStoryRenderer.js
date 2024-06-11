import inherits from "inherits";

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import Ids from "ids";

import { getAnnotationBoxHeight } from "../features/labeling/DSLabelEditingPreview";

import { componentsToPath, createLine } from "diagram-js/lib/util/RenderUtil";

import {
	append as svgAppend,
	attr as svgAttr,
	classes as svgClasses,
	create as svgCreate,
} from "tiny-svg";

import { query as domQuery } from "min-dom";

import { assign, isObject } from "min-dash";

import { getNumberStash } from "../features/labeling/DSLabelEditingProvider";

import {
	addNumberToRegistry,
	generateAutomaticNumber,
	numberBoxDefinitions,
} from "../features/numbering/numbering";

import { makeDirty } from "../features/export/dirtyFlag";
import { calculateTextWidth } from "../features/labeling/DSLabelUtil";
import { countLines, labelPosition } from "../features/labeling/position";
import { correctElementRegitryInit } from "./canvasElementRegistry";
import {
	ACTIVITY,
	ACTOR,
	CONNECTION,
	GROUP,
	TEXTANNOTATION,
	WORKOBJECT,
} from "./elementTypes";
import { getTypeIconSRC } from "./icon/dictionaries";

const RENDERER_IDS = new Ids();
const numbers = [];
const DEFAULT_COLOR = "black";

/**
 * a renderer that knows how to render custom elements.
 */
export default function DomainStoryRenderer(
	eventBus,
	styles,
	canvas,
	textRenderer,
	pathMap,
	commandStack,
) {
	BaseRenderer.call(this, eventBus, 2000);

	const rendererId = RENDERER_IDS.next();
	const markers = {};
	const computeStyle = styles.computeStyle;

	// generate the automatic Number for an activity origintaing from an actor
	function generateActivityNumber(parentGfx, element, box) {
		// whenever we want to edit an activity, it gets redrawn as a new object
		// and the custom information is lost,
		// so we stash it before the editing occurs and set the value here
		const numberStash = getNumberStash();
		const semantic = element.businessObject;

		if (numberStash.use) {
			semantic.number = numberStash.number;
		}

		box.x -= 15;
		renderNumber(parentGfx, ".", backgroundStyle(box), element.type);

		numbers[semantic.number] = true;
		box.x += 39;
		box.y -= 5;

		const newRenderedNumber = renderNumber(
			parentGfx,
			semantic.number,
			numberStyle(box),
			element.type,
		);
		addNumberToRegistry(newRenderedNumber, semantic.number);
	}

	// style functions
	function numberStyle(box) {
		return {
			box: box,
			fitBox: true,
			style: assign({}, textRenderer.getExternalStyle(), {
				fill: "white",
				backgroundColor: "green",
				position: "absolute",
			}),
		};
	}

	function backgroundStyle(box) {
		return {
			box: box,
			fitBox: true,
			style: assign({}, textRenderer.getExternalStyle(), {
				fill: "#42aebb",
				fontSize: 150,
				position: "absolute",
				fontFamily: "Courier",
			}),
		};
	}

	// render functions
	// render label associated with actors and workobjects
	function renderEmbeddedLabel(parentGfx, element, align, padding) {
		const semantic = element.businessObject;
		return renderLabel(
			parentGfx,
			semantic.name,
			{
				box: element,
				align: align,
				padding: padding ? padding : 0,
				style: {
					fill: "#000000",
				},
			},
			element.type,
		);
	}

	// render label associated with activities
	function renderExternalLabel(parentGfx, element) {
		const semantic = element.businessObject;
		const waypoints = element.waypoints;

		const lines = countLines(semantic.name);

		if (element.waypoints != null) {
			const position = labelPosition(waypoints, lines);
			const startPoint = element.waypoints[position.selected];
			const endPoint = element.waypoints[position.selected + 1];
			const angle = Math.angleBetween(startPoint, endPoint);
			let alignment = "left";
			let boxWidth = 500;
			let xStart = position.x;

			// if the activity is horizontal, we want to center the label
			if (angle === 0 || angle === 180) {
				boxWidth = Math.abs(startPoint.x - endPoint.x);
				alignment = "center";
				xStart =
					(startPoint.x + endPoint.x) / 2 - calculateTextWidth(semantic.name);
			}

			const box = {
				textAlign: alignment,
				width: boxWidth,
				height: 30,
				x: xStart,
				y: position.y,
			};

			if (semantic.name && semantic.name.length) {
				return renderLabel(
					parentGfx,
					semantic.name,
					{
						box: box,
						fitBox: true,
						style: assign({}, textRenderer.getExternalStyle(), {
							fill: "black",
							wordWrap: "break-word",
							overflowWrap: "break-word",
							hyphens: "auto",
						}),
					},
					element.type,
				);
			}
		}
	}

	// render the number associated with an activity
	function renderExternalNumber(parentGfx, element) {
		if (element && element.source) {
			const semantic = element.businessObject;

			const box = numberBoxDefinitions(element);

			if (
				semantic.number == null &&
				element.source.type &&
				element.source.type.includes(ACTOR)
			) {
				generateAutomaticNumber(element, commandStack);
			}

			// render the bacground for the number
			if (
				semantic.number != "" &&
				semantic.number != null &&
				element.source.type.includes(ACTOR)
			) {
				generateActivityNumber(parentGfx, element, box);
			} else {
				semantic.number = null;
			}
		}
	}

	// render a number on the canvas
	function renderNumber(parentGfx, number, options, type) {
		if (number < 10) {
			number = "0" + String(number);
		}
		number = String(number);
		const text = textRenderer.createText(number || "", options);
		let height = 0;

		svgClasses(text).add("djs-labelNumber");

		// the coordinates of the activity label must be set directly and will not be taken from the box
		if (/:activity$/.test(type)) {
			text.innerHTML = manipulateInnerHTMLXLabel(
				text.children,
				options.box.x,
				0,
			);
			text.innerHTML = manipulateInnerHTMLYLabel(
				text.children,
				options.box.y,
				0,
			);
		} else if (/:actor/.test(type)) {
			height = parentGfx.firstChild.attributes.height.nodeValue;
			text.innerHTML = manipulateInnerHTMLYLabel(text.children, height, 0);
		} else if (/:workObject/.test(type)) {
			height = parentGfx.firstChild.attributes.height.nodeValue;
			text.innerHTML = manipulateInnerHTMLYLabel(text.children, height, 26);
		}

		svgAppend(parentGfx, text);
		return text;
	}

	// render a label on the canvas
	function renderLabel(parentGfx, label, options, type) {
		const text = textRenderer.createText(label || "", options);
		let height = 0;

		svgClasses(text).add("djs-label");

		// the coordinates of the activity label must be set directly and will not be taken from the box
		if (/:activity$/.test(type)) {
			text.innerHTML = manipulateInnerHTMLXLabel(
				text.children,
				options.box.x,
				0,
			);
			text.innerHTML = manipulateInnerHTMLYLabel(
				text.children,
				options.box.y,
				0,
			);
		} else if (/:actor/.test(type)) {
			height = parentGfx.firstChild.attributes.height.nodeValue;
			text.innerHTML = manipulateInnerHTMLYLabel(text.children, height, 0);
		} else if (/:workObject/.test(type)) {
			height = parentGfx.firstChild.attributes.height.nodeValue;
			text.innerHTML = manipulateInnerHTMLYLabel(text.children, height, 26);
		}

		svgAppend(parentGfx, text);
		return text;
	}

	// determine the Y-coordinate of the label / number to be rendered
	function manipulateInnerHTMLYLabel(children, y, offset) {
		if (children) {
			let result = "";
			for (let i = 0; i < children.length; i++) {
				result += children[i].outerHTML.replace(
					/y="-?\d*.\d*"/,
					'y="' + (Number(y) + offset + 14 * i) + '"',
				);
			}

			return result;
		}
	}

	// determine the X-coordinate of the label / number to be rendered
	function manipulateInnerHTMLXLabel(children, x, offset) {
		if (children) {
			let result = "";
			for (let i = 0; i < children.length; i++) {
				result += children[i].outerHTML.replace(
					/x="-?\d*.\d*"/,
					'x="' + (Number(x) + offset + 14 * 1) + '"',
				);
			}

			return result;
		}
	}

	// draw functions
	this.drawGroup = (parentGfx, element) => {
		if (!element.businessObject.pickedColor) {
			element.businessObject.pickedColor = DEFAULT_COLOR;
		}
		const rect = drawRect(
			parentGfx,
			element.width,
			element.height,
			0,
			assign(
				{
					fill: "none",
					stroke: element.businessObject.pickedColor,
				},
				element.attrs,
			),
		);

		renderEmbeddedLabel(parentGfx, element, "left-top", 8);

		return rect;
	};

	this.drawActor = (p, element) => {
		let svgDynamicSizeAttributes = {
				width: element.width,
				height: element.height,
			},
			actor;
		let iconSRC = getTypeIconSRC(ACTOR, element.type);

		if (iconSRC.startsWith("data")) {
			iconSRC =
				'<svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
				'<image width="24" height="24" xlink:href="' +
				iconSRC +
				'"/></svg>';
		} else {
			if (!element.businessObject.pickedColor) {
				element.businessObject.pickedColor = DEFAULT_COLOR;
			}
			const match = iconSRC.match(/fill=".*?"/);
			if (match && match.length > 1) {
				iconSRC = iconSRC.replace(
					/fill=".*?"/,
					'fill="' + element.businessObject.pickedColor + '"',
				);
			} else {
				const index = iconSRC.indexOf("<svg ") + 5;
				iconSRC =
					iconSRC.substring(0, index) +
					' fill=" ' +
					element.businessObject.pickedColor +
					'" ' +
					iconSRC.substring(index);
			}
		}
		actor = svgCreate(iconSRC);

		svgAttr(actor, svgDynamicSizeAttributes);
		svgAppend(p, actor);

		renderEmbeddedLabel(p, element, "center", -5);
		return actor;
	};

	this.drawWorkObject = (p, element) => {
		let svgDynamicSizeAttributes = {
				width: element.width * 0.65,
				height: element.height * 0.65,
				x: element.width / 2 - 25,
				y: element.height / 2 - 25,
			},
			workObject;
		let iconSRC = getTypeIconSRC(WORKOBJECT, element.type);
		if (iconSRC.startsWith("data")) {
			iconSRC =
				'<svg viewBox="0 0 24 24" width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
				'<image width="24" height="24" xlink:href="' +
				iconSRC +
				'"/></svg>';
		} else {
			if (!element.businessObject.pickedColor) {
				element.businessObject.pickedColor = DEFAULT_COLOR;
			}
			if (iconSRC.match(/fill=".*?"/).length > 1) {
				iconSRC = iconSRC.replace(
					/fill=".*?"/,
					'fill="' + element.businessObject.pickedColor + '"',
				);
			} else {
				const index = iconSRC.indexOf("<svg ") + 5;
				iconSRC =
					iconSRC.substring(0, index) +
					' fill=" ' +
					element.businessObject.pickedColor +
					'" ' +
					iconSRC.substring(index);
			}
		}
		workObject = svgCreate(iconSRC);

		svgAttr(workObject, svgDynamicSizeAttributes);
		svgAppend(p, workObject);
		renderEmbeddedLabel(p, element, "center", -5);

		return workObject;
	};

	this.drawActivity = (p, element) => {
		adjustForTextOverlapp(element);

		if (element) {
			if (!element.businessObject.pickedColor) {
				element.businessObject.pickedColor = "black";
			}
			const attrs = computeStyle(attrs, {
				stroke: element.businessObject.pickedColor,
				fill: "none",
				strokeWidth: 1.5,
				strokeLinejoin: "round",
				markerEnd: marker(
					"activity",
					"black",
					element.businessObject.pickedColor,
				),
			});

			const x = svgAppend(p, createLine(element.waypoints, attrs));
			renderExternalLabel(p, element);
			renderExternalNumber(p, element);

			// just adjusting the start- and enpoint of the connection-element moves only the drawn connection,
			// not the interactive line. This can be fixed by manually overriding the points of the interactive polyline
			// in the HTMl with the points of the drawn one.
			// this however does not adjust the surrounding box of the connection.
			fixConnectionInHTML(p.parentElement);

			return x;
		}
	};

	function adjustForTextOverlapp(element) {
		const source = element.source;
		const target = element.target;

		const waypoints = element.waypoints;
		const startPoint = waypoints[0];
		const endPoint = waypoints[waypoints.length - 1];

		if (startPoint && endPoint && source && target) {
			// check if Startpoint can overlapp with text
			if (startPoint.y > source.y + 60) {
				if (startPoint.x > source.x + 3 && startPoint.x < source.x + 72) {
					const lineOffset = getLineOffset(source);
					if (source.y + 75 + lineOffset > startPoint.y) {
						startPoint.y += lineOffset;
					}
				}
			}

			// check if Endpoint can overlapp with text
			if (endPoint.y > target.y + 60) {
				if (endPoint.x > target.x + 3 && endPoint.x < target.x + 72) {
					const lineOffset = getLineOffset(target);
					if (target.y + 75 + lineOffset > endPoint.y) {
						endPoint.y += lineOffset;
					}
				}
			}
		}
	}

	function getLineOffset(element) {
		const id = element.id;
		let offset = 0;

		const objects = document.getElementsByClassName("djs-element djs-shape");
		for (let i = 0; i < objects.length; i++) {
			const data_id = objects.item(i).getAttribute("data-element-id");
			if (data_id == id) {
				const object = objects.item(i);
				const text = object.getElementsByTagName("text")[0];
				const tspans = text.getElementsByTagName("tspan");
				const tspan = tspans[tspans.length - 1];
				const y = tspan.getAttribute("y");
				offset = y;
			}
		}
		return offset - 70;
	}

	function fixConnectionInHTML(wantedConnection) {
		if (wantedConnection) {
			const polylines = wantedConnection.getElementsByTagName("polyline");
			if (polylines.length > 1) {
				polylines[1].setAttribute(
					"points",
					polylines[0].getAttribute("points"),
				);
			}
		}
	}

	this.drawDSConnection = (p, element) => {
		const attrs = computeStyle(attrs, {
			stroke: "#000000",
			strokeWidth: 1.5,
			strokeLinejoin: "round",
			strokeDasharray: "5, 5",
		});

		return svgAppend(p, createLine(element.waypoints, attrs));
	};

	this.drawAnnotation = (parentGfx, element) => {
		const style = {
			fill: "none",
			stroke: "none",
		};

		const text = element.businessObject.text || "";
		if (element.businessObject.text) {
			let height = getAnnotationBoxHeight();

			if (height === 0 && element.businessObject.number) {
				height = element.businessObject.number;
			}
			assign(element, {
				height: height,
			});

			// for some reason the keyword height is not exported, so we use another, which we know will be exported,
			// to ensure persistent annotation heights betweens sessions
			assign(element.businessObject, {
				number: height,
			});
		}

		const textElement = drawRect(
			parentGfx,
			element.width,
			element.height,
			0,
			0,
			style,
		);
		const textPathData = pathMap.getScaledPath("TEXT_ANNOTATION", {
			xScaleFactor: 1,
			yScaleFactor: 1,
			containerWidth: element.width,
			containerHeight: element.height,
			position: {
				mx: 0.0,
				my: 0.0,
			},
		});

		drawPath(parentGfx, textPathData, {
			stroke: "black",
		});

		renderLabel(parentGfx, text, {
			box: element,
			align: "left-top",
			padding: 5,
			style: {
				fill: "black",
			},
		});

		return textElement;
	};

	// draw helper functions
	function drawPath(parentGfx, d, attrs) {
		attrs = computeStyle(attrs, ["no-fill"], {
			strokeWidth: 2,
			stroke: "black",
		});

		const path = svgCreate("path");
		svgAttr(path, { d: d });
		svgAttr(path, attrs);

		svgAppend(parentGfx, path);

		return path;
	}

	function drawRect(parentGfx, width, height, r, offset, attrs) {
		if (isObject(offset)) {
			attrs = offset;
			offset = 0;
		}

		offset = offset || 0;
		attrs = computeStyle(attrs, {
			stroke: "black",
			strokeWidth: 2,
			fill: "white",
		});

		const rect = svgCreate("rect");
		svgAttr(rect, {
			x: offset,
			y: offset,
			width: width - offset * 2,
			height: height - offset * 2,
			rx: r,
			ry: r,
		});

		svgAttr(rect, attrs);
		svgAppend(parentGfx, rect);

		return rect;
	}

	// marker functions
	function marker(type, fill, stroke) {
		const id = type + "-" + fill + "-" + stroke + "-" + rendererId;

		if (!markers[id]) {
			createMarker(type, fill, stroke);
		}
		return "url(#" + id + ")";
	}

	function createMarker(type, fill, stroke) {
		const id = type + "-" + fill + "-" + stroke + "-" + rendererId;

		if (type === "activity") {
			const sequenceflowEnd = svgCreate("path");
			svgAttr(sequenceflowEnd, { d: "M 1 5 L 11 10 L 1 15 Z" });

			addMarker(id, {
				element: sequenceflowEnd,
				ref: { x: 11, y: 10 },
				scale: 0.5,
				attrs: {
					fill: stroke,
					stroke: stroke,
				},
			});
		}
	}

	function addMarker(id, options) {
		const attrs = assign(
			{
				fill: "black",
				strokeWidth: 1,
				strokeLinecap: "round",
				strokeDasharray: "none",
			},
			options.attrs,
		);

		const ref = options.ref || { x: 0, y: 0 };
		const scale = options.scale || 1;

		// resetting stroke dash array
		if (attrs.strokeDasharray === "none") {
			attrs.strokeDasharray = [10000, 1];
		}

		const marker = svgCreate("marker");

		svgAttr(options.element, attrs);
		svgAppend(marker, options.element);
		svgAttr(marker, {
			id: id,
			viewBox: "0 0 20 20",
			refX: ref.x,
			refY: ref.y,
			markerWidth: 20 * scale,
			markerHeight: 20 * scale,
			orient: "auto",
		});

		let defs = domQuery("defs", canvas._svg);
		if (!defs) {
			defs = svgCreate("defs");
			svgAppend(canvas._svg, defs);
		}
		svgAppend(defs, marker);
		markers[id] = marker;
	}

	// path functions
	this.getWorkObjectPath = (shape) => {
		const rectangle = getRectPath(shape);
		return componentsToPath(rectangle);
	};

	this.getGroupPath = (shape) => {
		const rectangle = getRectPath(shape);
		return componentsToPath(rectangle);
	};

	this.getActivityPath = (connection) => {
		const waypoints = connection.waypoints.map((p) => p.original || p);

		const activityPath = [["M", waypoints[0].x, waypoints[0].y]];

		waypoints.forEach((waypoint, index) => {
			if (index !== 0) {
				activityPath.push(["L", waypoint.x, waypoint.y]);
			}
		});
		return componentsToPath(activityPath);
	};

	this.getActorPath = (shape) => {
		const rectangle = getRectPath(shape);
		return componentsToPath(rectangle);
	};
}

inherits(DomainStoryRenderer, BaseRenderer);

DomainStoryRenderer.$inject = [
	"eventBus",
	"styles",
	"canvas",
	"textRenderer",
	"pathMap",
	"commandStack",
];

DomainStoryRenderer.prototype.canRender = (element) =>
	/^domainStory:/.test(element.type);

DomainStoryRenderer.prototype.drawShape = function (p, element) {
	// polyfill for tests
	if (!String.prototype.startsWith) {
		Object.defineProperty(String.prototype, "startsWith", {
			value: function (search, pos) {
				pos = !pos || pos < 0 ? 0 : +pos;
				return this.substring(pos, pos + search.length) === search;
			},
		});
	}

	const type = element.type;
	element.businessObject.type = type;

	correctElementRegitryInit();
	makeDirty();

	if (type.includes(ACTOR)) {
		return this.drawActor(p, element);
	} else if (type.includes(WORKOBJECT)) {
		return this.drawWorkObject(p, element);
	} else if (type.includes(TEXTANNOTATION)) {
		return this.drawAnnotation(p, element);
	} else if (type.includes(GROUP)) {
		return this.drawGroup(p, element);
	}
};

DomainStoryRenderer.prototype.getShapePath = function (shape) {
	const type = shape.type;

	if (type.includes(ACTOR)) {
		return this.getActorPath(shape);
	} else if (type.includes(WORKOBJECT)) {
		return this.getWorkObjectPath(shape);
	} else if (type.includes(GROUP)) {
		return this.getGroupPath(shape);
	}
};

DomainStoryRenderer.prototype.drawConnection = function (p, element) {
	const type = element.type;

	makeDirty();

	if (!element.businessObject.type) {
		element.businessObject.type = type;
	}

	if (type === ACTIVITY) {
		return this.drawActivity(p, element);
	} else if (type === CONNECTION) {
		return this.drawDSConnection(p, element);
	}
};

DomainStoryRenderer.prototype.getConnectionPath = function (connection) {
	const type = connection.type;

	if (type === ACTIVITY || type === CONNECTION) {
		return this.getActivityPath(connection);
	}
};

// creates a SVG path that describes a rectangle which encloses the given shape.
function getRectPath(shape) {
	const offset = 5;
	const x = shape.x,
		y = shape.y,
		width = shape.width / 2 + offset,
		height = shape.height / 2 + offset;

	const rectPath = [
		["M", x, y],
		["l", width, 0],
		["l", width, height],
		["l", -width, height],
		["l", -width, 0],
		["z"],
	];
	return rectPath;
}
