import type { XMLNode } from '../xml/generator.ts';

// Base class for all elements that can be converted to XMLNode
export abstract class WPMLElement {
	abstract toXMLNode(): XMLNode;
}

// Coordinate class for Points
export class Coordinate {
	longitude: number;
	latitude: number;

	constructor(longitude: number, latitude: number) {
		this.longitude = longitude;
		this.latitude = latitude;
	}

	toString(): string {
		return `${this.longitude},${this.latitude}`;
	}
}

// Heading parameter for waypoints
export class WaypointHeadingParam extends WPMLElement {
	mode: string;
	angle: number;
	poiPoint: string;
	angleEnable: number;
	pathMode: string;
	poiIndex: number;

	constructor(data: Partial<WaypointHeadingParam> = {}) {
		super();
		this.mode = data.mode ?? 'smoothTransition';
		this.angle = data.angle ?? 0;
		this.poiPoint = data.poiPoint ?? '0.000000,0.000000,0.000000';
		this.angleEnable = data.angleEnable ?? 0;
		this.pathMode = data.pathMode ?? 'followBadArc';
		this.poiIndex = data.poiIndex ?? 0;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'waypointHeadingParam',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'waypointHeadingMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.mode,
				},
				{
					tagName: 'waypointHeadingAngle',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.angle.toString(),
				},
				{
					tagName: 'waypointPoiPoint',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.poiPoint,
				},
				{
					tagName: 'waypointHeadingAngleEnable',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.angleEnable.toString(),
				},
				{
					tagName: 'waypointHeadingPathMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.pathMode,
				},
				{
					tagName: 'waypointHeadingPoiIndex',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.poiIndex.toString(),
				},
			],
			textContent: '',
		};
	}
}

// Turn parameter for waypoints
export class WaypointTurnParam extends WPMLElement {
	mode: string;
	dampingDist: number;

	constructor(data: Partial<WaypointTurnParam> = {}) {
		super();
		this.mode = data.mode ?? 'toPointAndStopWithContinuityCurvature';
		this.dampingDist = data.dampingDist ?? 0;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'waypointTurnParam',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'waypointTurnMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.mode,
				},
				{
					tagName: 'waypointTurnDampingDist',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.dampingDist.toString(),
				},
			],
			textContent: '',
		};
	}
}

// Gimbal heading parameter for waypoints
export class WaypointGimbalHeadingParam extends WPMLElement {
	pitchAngle: number;
	yawAngle: number;

	constructor(data: Partial<WaypointGimbalHeadingParam> = {}) {
		super();
		this.pitchAngle = data.pitchAngle ?? 0;
		this.yawAngle = data.yawAngle ?? 0;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'waypointGimbalHeadingParam',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'waypointGimbalPitchAngle',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.pitchAngle.toString(),
				},
				{
					tagName: 'waypointGimbalYawAngle',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.yawAngle.toString(),
				},
			],
			textContent: '',
		};
	}
}

// Action function parameter for actions
export class ActionFunctionParam extends WPMLElement {
	type: string;
	params: Record<string, string | number>;

	constructor(type: string, params: Record<string, string | number> = {}) {
		super();
		this.type = type;
		this.params = params;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'actionActuatorFuncParam',
			namespace: 'wpml',
			attributes: {},
			children: Object.entries(this.params).map(([key, value]) => ({
				tagName: key,
				namespace: 'wpml',
				attributes: {},
				children: [],
				textContent: value.toString(),
			})),
			textContent: '',
		};
	}
}

// Action for waypoints
export class Action extends WPMLElement {
	id: number;
	actuatorFunc: string;
	functionParam: ActionFunctionParam;

	constructor(
		id: number,
		actuatorFunc: string,
		functionParam: ActionFunctionParam,
	) {
		super();
		this.id = id;
		this.actuatorFunc = actuatorFunc;
		this.functionParam = functionParam;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'action',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'actionId',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.id.toString(),
				},
				{
					tagName: 'actionActuatorFunc',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.actuatorFunc,
				},
				this.functionParam.toXMLNode(),
			],
			textContent: '',
		};
	}
}

// Action trigger for action groups
export class ActionTrigger extends WPMLElement {
	type: string;

	constructor(type: string = 'reachPoint') {
		super();
		this.type = type;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'actionTrigger',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'actionTriggerType',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.type,
				},
			],
			textContent: '',
		};
	}
}

// Action group for waypoints
export class ActionGroup extends WPMLElement {
	id: number;
	startIndex: number;
	endIndex: number;
	mode: string;
	trigger: ActionTrigger;
	actions: Action[];

	constructor(
		data: Partial<ActionGroup> & {
			id: number;
			startIndex: number;
			endIndex: number;
		},
	) {
		super();
		this.id = data.id;
		this.startIndex = data.startIndex;
		this.endIndex = data.endIndex;
		this.mode = data.mode ?? 'parallel';
		this.trigger = data.trigger ?? new ActionTrigger();
		this.actions = data.actions ?? [];
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'actionGroup',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'actionGroupId',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.id.toString(),
				},
				{
					tagName: 'actionGroupStartIndex',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.startIndex.toString(),
				},
				{
					tagName: 'actionGroupEndIndex',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.endIndex.toString(),
				},
				{
					tagName: 'actionGroupMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.mode,
				},
				this.trigger.toXMLNode(),
				...this.actions.map((action) => action.toXMLNode()),
			],
			textContent: '',
		};
	}
}

// Placemark class (Waypoint)
export class Waypoint extends WPMLElement {
	index: number;
	coordinate: Coordinate;
	executeHeight: number;
	waypointSpeed: number;
	headingParam: WaypointHeadingParam;
	turnParam: WaypointTurnParam;
	useStraightLine: number;
	gimbalHeadingParam: WaypointGimbalHeadingParam;
	actionGroups: ActionGroup[];

	constructor(
		data: Partial<Waypoint> & { index: number; coordinate: Coordinate },
	) {
		super();
		this.index = data.index;
		this.coordinate = data.coordinate;
		this.executeHeight = data.executeHeight ?? 2;
		this.waypointSpeed = data.waypointSpeed ?? 12;
		this.headingParam = data.headingParam ?? new WaypointHeadingParam();
		this.turnParam = data.turnParam ?? new WaypointTurnParam();
		this.useStraightLine = data.useStraightLine ?? 0;
		this.gimbalHeadingParam = data.gimbalHeadingParam ??
			new WaypointGimbalHeadingParam();
		this.actionGroups = data.actionGroups ?? [];
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'Placemark',
			namespace: null,
			attributes: {},
			children: [
				{
					tagName: 'Point',
					namespace: null,
					attributes: {},
					children: [
						{
							tagName: 'coordinates',
							namespace: null,
							attributes: {},
							children: [],
							textContent: this.coordinate.toString(),
						},
					],
					textContent: '',
				},
				{
					tagName: 'index',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.index.toString(),
				},
				{
					tagName: 'executeHeight',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.executeHeight.toString(),
				},
				{
					tagName: 'waypointSpeed',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.waypointSpeed.toString(),
				},
				this.headingParam.toXMLNode(),
				this.turnParam.toXMLNode(),
				{
					tagName: 'useStraightLine',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.useStraightLine.toString(),
				},
				...this.actionGroups.map((group) => group.toXMLNode()),
				this.gimbalHeadingParam.toXMLNode(),
			],
			textContent: '',
		};
	}
}

// Wayline class (Folder)
export class Wayline extends WPMLElement {
	templateId: number;
	executeHeightMode: string;
	waylineId: number;
	distance: number;
	duration: number;
	autoFlightSpeed: number;
	waypoints: Waypoint[];

	constructor(data: Partial<Wayline> = {}) {
		super();
		this.templateId = data.templateId ?? 0;
		this.executeHeightMode = data.executeHeightMode ?? 'relativeToStartPoint';
		this.waylineId = data.waylineId ?? 0;
		this.distance = data.distance ?? 0;
		this.duration = data.duration ?? 0;
		this.autoFlightSpeed = data.autoFlightSpeed ?? 2.5;
		this.waypoints = data.waypoints ?? [];
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'Folder',
			namespace: null,
			attributes: {},
			children: [
				{
					tagName: 'templateId',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.templateId.toString(),
				},
				{
					tagName: 'executeHeightMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.executeHeightMode,
				},
				{
					tagName: 'waylineId',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.waylineId.toString(),
				},
				{
					tagName: 'distance',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.distance.toString(),
				},
				{
					tagName: 'duration',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.duration.toString(),
				},
				{
					tagName: 'autoFlightSpeed',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.autoFlightSpeed.toString(),
				},
				...this.waypoints.map((waypoint) => waypoint.toXMLNode()),
			],
			textContent: '',
		};
	}
}

// DroneInfo class
export class DroneInfo extends WPMLElement {
	droneEnumValue: number;
	droneSubEnumValue: number;

	constructor(data: Partial<DroneInfo> = {}) {
		super();
		this.droneEnumValue = data.droneEnumValue ?? 68;
		this.droneSubEnumValue = data.droneSubEnumValue ?? 0;
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'droneInfo',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'droneEnumValue',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.droneEnumValue.toString(),
				},
				{
					tagName: 'droneSubEnumValue',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.droneSubEnumValue.toString(),
				},
			],
			textContent: '',
		};
	}
}

// MissionConfig class
export class MissionConfig extends WPMLElement {
	flyToWaylineMode: string;
	finishAction: string;
	exitOnRCLost: string;
	executeRCLostAction: string;
	globalTransitionalSpeed: number;
	droneInfo: DroneInfo;

	constructor(data: Partial<MissionConfig> = {}) {
		super();
		this.flyToWaylineMode = data.flyToWaylineMode ?? 'safely';
		this.finishAction = data.finishAction ?? 'goHome';
		this.exitOnRCLost = data.exitOnRCLost ?? 'executeLostAction';
		this.executeRCLostAction = data.executeRCLostAction ?? 'hover';
		this.globalTransitionalSpeed = data.globalTransitionalSpeed ?? 12;
		this.droneInfo = data.droneInfo ?? new DroneInfo();
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'missionConfig',
			namespace: 'wpml',
			attributes: {},
			children: [
				{
					tagName: 'flyToWaylineMode',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.flyToWaylineMode,
				},
				{
					tagName: 'finishAction',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.finishAction,
				},
				{
					tagName: 'exitOnRCLost',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.exitOnRCLost,
				},
				{
					tagName: 'executeRCLostAction',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.executeRCLostAction,
				},
				{
					tagName: 'globalTransitionalSpeed',
					namespace: 'wpml',
					attributes: {},
					children: [],
					textContent: this.globalTransitionalSpeed.toString(),
				},
				this.droneInfo.toXMLNode(),
			],
			textContent: '',
		};
	}
}

// WPMLDocument class (root of the WPML file)
export class WPMLDocument extends WPMLElement {
	missionConfig: MissionConfig;
	waylines: Wayline[];
	author?: string;
	createTime?: number;
	updateTime?: number;

	constructor(data: Partial<WPMLDocument> = {}) {
		super();
		this.missionConfig = data.missionConfig ?? new MissionConfig();
		this.waylines = data.waylines ?? [];
		this.author = data.author;
		this.createTime = data.createTime;
		this.updateTime = data.updateTime;
	}

	toXMLNode(): XMLNode {
		const documentChildren: XMLNode[] = [];

		if (this.author) {
			documentChildren.push({
				tagName: 'author',
				namespace: 'wpml',
				attributes: {},
				children: [],
				textContent: this.author,
			});
		}

		if (this.createTime) {
			documentChildren.push({
				tagName: 'createTime',
				namespace: 'wpml',
				attributes: {},
				children: [],
				textContent: this.createTime.toString(),
			});
		}

		if (this.updateTime) {
			documentChildren.push({
				tagName: 'updateTime',
				namespace: 'wpml',
				attributes: {},
				children: [],
				textContent: this.updateTime.toString(),
			});
		}

		documentChildren.push(this.missionConfig.toXMLNode());
		documentChildren.push(
			...this.waylines.map((wayline) => wayline.toXMLNode()),
		);

		return {
			tagName: 'kml',
			namespace: null,
			attributes: {
				xmlns: 'http://www.opengis.net/kml/2.2',
				'xmlns:wpml': 'http://www.dji.com/wpmz/1.0.2',
			},
			children: [
				{
					tagName: 'Document',
					namespace: null,
					attributes: {},
					children: documentChildren,
					textContent: '',
				},
			],
			textContent: '',
		};
	}
}
