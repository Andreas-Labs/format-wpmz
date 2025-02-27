import type { XMLNode } from '../xml/generator.ts';

interface DroneInfo {
	droneEnumValue: number;
	droneSubEnumValue: number;
}

interface MissionConfig {
	flyToWaylineMode: 'safely';
	finishAction: 'goHome';
	exitOnRCLost: 'executeLostAction';
	executeRCLostAction: 'hover';
	globalTransitionalSpeed: number;
	droneInfo: DroneInfo;
}

export class KMLTemplate {
	author: string;
	createTime: number;
	updateTime: number;
	missionConfig: MissionConfig;

	constructor(data: Partial<KMLTemplate> = {}) {
		this.author = data.author ?? 'fly';
		this.createTime = data.createTime ?? Date.now();
		this.updateTime = data.updateTime ?? this.createTime;
		this.missionConfig = {
			flyToWaylineMode: 'safely',
			finishAction: 'goHome',
			exitOnRCLost: 'executeLostAction',
			executeRCLostAction: 'hover',
			globalTransitionalSpeed: data.missionConfig?.globalTransitionalSpeed ??
				12,
			droneInfo: {
				droneEnumValue: data.missionConfig?.droneInfo?.droneEnumValue ?? 68,
				droneSubEnumValue: data.missionConfig?.droneInfo?.droneSubEnumValue ??
					0,
			},
		};
	}

	toXMLNode(): XMLNode {
		return {
			tagName: 'kml',
			namespace: null,
			attributes: {
				'xmlns': 'http://www.opengis.net/kml/2.2',
				'xmlns:wpml': 'http://www.dji.com/wpmz/1.0.2',
			},
			children: [
				{
					tagName: 'Document',
					namespace: null,
					attributes: {},
					children: [
						{
							tagName: 'author',
							namespace: 'wpml',
							attributes: {},
							children: [],
							textContent: this.author,
						},
						{
							tagName: 'createTime',
							namespace: 'wpml',
							attributes: {},
							children: [],
							textContent: this.createTime.toString(),
						},
						{
							tagName: 'updateTime',
							namespace: 'wpml',
							attributes: {},
							children: [],
							textContent: this.updateTime.toString(),
						},
						{
							tagName: 'missionConfig',
							namespace: 'wpml',
							attributes: {},
							children: [
								{
									tagName: 'flyToWaylineMode',
									namespace: 'wpml',
									attributes: {},
									children: [],
									textContent: this.missionConfig.flyToWaylineMode,
								},
								{
									tagName: 'finishAction',
									namespace: 'wpml',
									attributes: {},
									children: [],
									textContent: this.missionConfig.finishAction,
								},
								{
									tagName: 'exitOnRCLost',
									namespace: 'wpml',
									attributes: {},
									children: [],
									textContent: this.missionConfig.exitOnRCLost,
								},
								{
									tagName: 'executeRCLostAction',
									namespace: 'wpml',
									attributes: {},
									children: [],
									textContent: this.missionConfig.executeRCLostAction,
								},
								{
									tagName: 'globalTransitionalSpeed',
									namespace: 'wpml',
									attributes: {},
									children: [],
									textContent: this.missionConfig.globalTransitionalSpeed
										.toString(),
								},
								{
									tagName: 'droneInfo',
									namespace: 'wpml',
									attributes: {},
									children: [
										{
											tagName: 'droneEnumValue',
											namespace: 'wpml',
											attributes: {},
											children: [],
											textContent: this.missionConfig.droneInfo.droneEnumValue
												.toString(),
										},
										{
											tagName: 'droneSubEnumValue',
											namespace: 'wpml',
											attributes: {},
											children: [],
											textContent: this.missionConfig.droneInfo
												.droneSubEnumValue.toString(),
										},
									],
									textContent: '',
								},
							],
							textContent: '',
						},
					],
					textContent: '',
				},
			],
			textContent: '',
		};
	}
}
