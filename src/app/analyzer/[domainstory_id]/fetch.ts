import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
	"/api/v2",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllRqas = async () => {
	const res = await fetch(`${backendUrl}/rqa`, {
		next: { tags: ["rqas"], revalidate: 30 },
	});
	const data: RuntimeQualityAnalysisDefinition[] = await res.json();
	return data;
};

export const readDomainstoryById = async (id: string) => {
	const res = await fetch(`${backendUrl}/domain-story/${id}`);
	const json = await res.json();
	const data: DomainStory = json;
	return data;
};

const testData = {
	software_system: {
		name: "autohaus",
		environment: "DEV",
		services: [
			{
				name: "autohaus",
				deployment_name: "ddd-autohaus",
				uri: "http:localhost:9000",
				programming_framework: { type: "spring-boot", version: "2.7.4" },
				programming_language: "Java",
				instrumentation_framework: {
					name: "inspectIT Ocelot",
					existing: false,
					has_metrics: false,
					has_traces: false,
					has_logging: false,
					options: {
						INSPECTIT_EXPORTERS_METRICS_OTLP_ENABLED: "true",
						INSPECTIT_EXPORTERS_METRICS_OTLP_ENDPOINT:
							"http://otel-collector:4317",
						INSPECTIT_EXPORTERS_METRICS_OTLP_PROTOCOL: "grpc",
						INSPECTIT_EXPORTERS_TRACING_OTLP_ENABLED: "true",
						INSPECTIT_EXPORTERS_TRACING_OTLP_ENDPOINT:
							"http://otel-collector:4317",
						INSPECTIT_EXPORTERS_TRACING_OTLP_PROTOCOL: "grpc",
						INSPECTIT_EXPORTERS_TRACING_LOGGING_ENABLED: "true",
						INSPECTIT_SERVICE_NAME: "autohaus",
					},
				},
				runtime_platform_id: "docker-local",
				endpoints: [
					{
						name: "auftrag-lesen",
						code_component: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
						route: "/auftrag/{auftragsnummer}",
						parameter: [
							{
								type: "PathVariable",
								data: "auftrag/auftragsnummern/angelegt.json",
							},
						],
						methods: ["GET"],
						response_description: {
							format: "object",
							expected_status_codes: [200],
						},
					},
					{
						name: "auftrag-erstellen",
						code_component: "547e0799-104e-4715-854d-d71a9542faee",
						route: "/auftrag/new",
						parameter: [
							{ type: "Header", data: "auftrag/allgemein/headers.json" },
							{
								type: "RequestBody",
								data: "auftrag/auftraggeber/2022/auftraggeber.json",
							},
						],
						methods: ["POST"],
						response_description: {
							format: "object",
							expected_status_codes: [201],
						},
					},
					{
						name: "status-veraendern",
						code_component: "84065e29-d49b-476a-9608-15393e3d0e30",
						route: "/auftrag/{auftragsnummer}",
						parameter: [
							{ type: "Header", data: "auftrag/allgemein/headers.json" },
							{
								type: "PathVariable",
								data: "auftrag/auftragsnummern/angelegt.json",
							},
							{
								type: "RequestBody",
								data: "auftrag/auftragsstatus/auftragsstatus.json",
							},
						],
						methods: ["PUT"],
						response_description: {
							format: "string",
							expected_status_codes: [200],
						},
					},
				],
				api_schema: {
					version: "3.0.0",
					context: "autohaus",
					api: "OpenAPI",
					server_info: [{ host: "localhost", environment: "DEV" }],
					field: [],
					data_schemas: {},
					id: null,
				},
				code_components: [
					{
						name: "WerkstattauftragController",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController",
						file: "WerkstattauftragController.java",
						type: "controller",
						implements: [],
						objects: [],
						activities: [],
						id: "b0c8d460-ea74-4163-a463-f4a7aa1f3808",
					},
					{
						name: "readAuftrag",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#readAuftrag",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
					},
					{
						name: "createAuftrag",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#createAuftrag",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "547e0799-104e-4715-854d-d71a9542faee",
					},
					{
						name: "updateStatus",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#updateStatus",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "84065e29-d49b-476a-9608-15393e3d0e30",
					},
				],
				id: "668e7c110602773289442596",
			},
		],
		runtime_platforms: [],
		id: "668e7c110602773289442597",
		code_components: [
			{
				name: "readAuftrag",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#readAuftrag",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
			},
			{
				name: "updateStatus",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#updateStatus",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "84065e29-d49b-476a-9608-15393e3d0e30",
			},
			{
				name: "WerkstattauftragController",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController",
				file: "WerkstattauftragController.java",
				type: "controller",
				implements: [],
				objects: [],
				activities: [],
				id: "b0c8d460-ea74-4163-a463-f4a7aa1f3808",
			},
			{
				name: "createAuftrag",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#createAuftrag",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "547e0799-104e-4715-854d-d71a9542faee",
			},
		],
		endpoints: [
			{
				name: "status-veraendern",
				code_component: "84065e29-d49b-476a-9608-15393e3d0e30",
				route: "/auftrag/{auftragsnummer}",
				parameter: [
					{ type: "Header", data: "auftrag/allgemein/headers.json" },
					{
						type: "PathVariable",
						data: "auftrag/auftragsnummern/angelegt.json",
					},
					{
						type: "RequestBody",
						data: "auftrag/auftragsstatus/auftragsstatus.json",
					},
				],
				methods: ["PUT"],
				response_description: {
					format: "string",
					expected_status_codes: [200],
				},
			},
			{
				name: "auftrag-lesen",
				code_component: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
				route: "/auftrag/{auftragsnummer}",
				parameter: [
					{
						type: "PathVariable",
						data: "auftrag/auftragsnummern/angelegt.json",
					},
				],
				methods: ["GET"],
				response_description: {
					format: "object",
					expected_status_codes: [200],
				},
			},
			{
				name: "auftrag-erstellen",
				code_component: "547e0799-104e-4715-854d-d71a9542faee",
				route: "/auftrag/new",
				parameter: [
					{ type: "Header", data: "auftrag/allgemein/headers.json" },
					{
						type: "RequestBody",
						data: "auftrag/auftraggeber/2022/auftraggeber.json",
					},
				],
				methods: ["POST"],
				response_description: {
					format: "object",
					expected_status_codes: [201],
				},
			},
		],
		architecture_entities: [
			{
				name: "autohaus",
				deployment_name: "ddd-autohaus",
				uri: "http:localhost:9000",
				programming_framework: { type: "spring-boot", version: "2.7.4" },
				programming_language: "Java",
				instrumentation_framework: {
					name: "inspectIT Ocelot",
					existing: false,
					has_metrics: false,
					has_traces: false,
					has_logging: false,
					options: {
						INSPECTIT_EXPORTERS_METRICS_OTLP_ENABLED: "true",
						INSPECTIT_EXPORTERS_METRICS_OTLP_ENDPOINT:
							"http://otel-collector:4317",
						INSPECTIT_EXPORTERS_METRICS_OTLP_PROTOCOL: "grpc",
						INSPECTIT_EXPORTERS_TRACING_OTLP_ENABLED: "true",
						INSPECTIT_EXPORTERS_TRACING_OTLP_ENDPOINT:
							"http://otel-collector:4317",
						INSPECTIT_EXPORTERS_TRACING_OTLP_PROTOCOL: "grpc",
						INSPECTIT_EXPORTERS_TRACING_LOGGING_ENABLED: "true",
						INSPECTIT_SERVICE_NAME: "autohaus",
					},
				},
				runtime_platform_id: "docker-local",
				endpoints: [
					{
						name: "auftrag-lesen",
						code_component: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
						route: "/auftrag/{auftragsnummer}",
						parameter: [
							{
								type: "PathVariable",
								data: "auftrag/auftragsnummern/angelegt.json",
							},
						],
						methods: ["GET"],
						response_description: {
							format: "object",
							expected_status_codes: [200],
						},
					},
					{
						name: "auftrag-erstellen",
						code_component: "547e0799-104e-4715-854d-d71a9542faee",
						route: "/auftrag/new",
						parameter: [
							{ type: "Header", data: "auftrag/allgemein/headers.json" },
							{
								type: "RequestBody",
								data: "auftrag/auftraggeber/2022/auftraggeber.json",
							},
						],
						methods: ["POST"],
						response_description: {
							format: "object",
							expected_status_codes: [201],
						},
					},
					{
						name: "status-veraendern",
						code_component: "84065e29-d49b-476a-9608-15393e3d0e30",
						route: "/auftrag/{auftragsnummer}",
						parameter: [
							{ type: "Header", data: "auftrag/allgemein/headers.json" },
							{
								type: "PathVariable",
								data: "auftrag/auftragsnummern/angelegt.json",
							},
							{
								type: "RequestBody",
								data: "auftrag/auftragsstatus/auftragsstatus.json",
							},
						],
						methods: ["PUT"],
						response_description: {
							format: "string",
							expected_status_codes: [200],
						},
					},
				],
				api_schema: {
					version: "3.0.0",
					context: "autohaus",
					api: "OpenAPI",
					server_info: [{ host: "localhost", environment: "DEV" }],
					field: [],
					data_schemas: {},
					id: null,
				},
				code_components: [
					{
						name: "WerkstattauftragController",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController",
						file: "WerkstattauftragController.java",
						type: "controller",
						implements: [],
						objects: [],
						activities: [],
						id: "b0c8d460-ea74-4163-a463-f4a7aa1f3808",
					},
					{
						name: "readAuftrag",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#readAuftrag",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
					},
					{
						name: "createAuftrag",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#createAuftrag",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "547e0799-104e-4715-854d-d71a9542faee",
					},
					{
						name: "updateStatus",
						identifier:
							"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#updateStatus",
						file: "WerkstattauftragController.java",
						type: "method",
						implements: [],
						objects: [],
						activities: [],
						id: "84065e29-d49b-476a-9608-15393e3d0e30",
					},
				],
				id: "668e7c110602773289442596",
			},
			{
				name: "readAuftrag",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#readAuftrag",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
			},
			{
				name: "updateStatus",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#updateStatus",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "84065e29-d49b-476a-9608-15393e3d0e30",
			},
			{
				name: "WerkstattauftragController",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController",
				file: "WerkstattauftragController.java",
				type: "controller",
				implements: [],
				objects: [],
				activities: [],
				id: "b0c8d460-ea74-4163-a463-f4a7aa1f3808",
			},
			{
				name: "createAuftrag",
				identifier:
					"ddd.autohaus.tactical.design.app.werkstattauftrag.api.WerkstattauftragController#createAuftrag",
				file: "WerkstattauftragController.java",
				type: "method",
				implements: [],
				objects: [],
				activities: [],
				id: "547e0799-104e-4715-854d-d71a9542faee",
			},
		],
	},
	domain_story: {
		actors: [
			{
				"@type": "Person",
				name: "kunde",
				id: "3f659de2-de9e-4725-92fa-404201228bb0",
			},
			{
				"@type": "Person",
				name: "mitarbeiter",
				id: "9c7cdf1d-86ef-46e2-b2a3-72ec57d67961",
			},
			{
				"@type": "System",
				name: "auftragsportal",
				id: "199c3558-e953-4e55-a3b5-967ccd67970f",
			},
		],
		work_objects: [
			{
				"@type": "WorkObject",
				name: "auftrag",
				type: "DATA",
				value_objects: [],
				id: "4cceb356-b3d0-4b90-9da1-94603eb510e5",
			},
			{
				"@type": "WorkObject",
				name: "auftragsstatus",
				type: "DATA",
				value_objects: [],
				id: "982e141d-0706-4a2d-be70-ed145f21e691",
			},
		],
		activities: [
			{
				name: "liesst",
				action: "liesst",
				number: 1,
				initiators: ["3f659de2-de9e-4725-92fa-404201228bb0"],
				targets: ["199c3558-e953-4e55-a3b5-967ccd67970f"],
				work_objects: ["4cceb356-b3d0-4b90-9da1-94603eb510e5"],
				id: "2686a9ac-e7bc-438f-93b9-779c870c2c33",
			},
			{
				name: "erstellt",
				action: "erstellt",
				number: 2,
				initiators: ["9c7cdf1d-86ef-46e2-b2a3-72ec57d67961"],
				targets: ["199c3558-e953-4e55-a3b5-967ccd67970f"],
				work_objects: ["4cceb356-b3d0-4b90-9da1-94603eb510e5"],
				id: "9293d8d8-02d9-4b12-b4bb-16f6cd3c8966",
			},
			{
				name: "veraendert",
				action: "veraendert",
				number: 3,
				initiators: ["9c7cdf1d-86ef-46e2-b2a3-72ec57d67961"],
				targets: ["199c3558-e953-4e55-a3b5-967ccd67970f"],
				work_objects: ["982e141d-0706-4a2d-be70-ed145f21e691"],
				id: "6e8050ef-a2f4-4df3-a0c4-821e8435c9b2",
			},
		],
		id: "668e7c110602773289442598",
	},
	mappings: [
		{
			"@type": "ActivityToCallMapping",
			dst_element_id: "2686a9ac-e7bc-438f-93b9-779c870c2c33",
			architecture_element_id: "da7a9de4-0c36-4ee1-9535-241b5bda13d9",
			end_correlation_id: null,
			start_correlation_id: null,
			end: null,
			is_async: false,
		},
		{
			"@type": "ActivityToCallMapping",
			dst_element_id: "6e8050ef-a2f4-4df3-a0c4-821e8435c9b2",
			architecture_element_id: "84065e29-d49b-476a-9608-15393e3d0e30",
			end_correlation_id: null,
			start_correlation_id: null,
			end: null,
			is_async: false,
		},
		{
			"@type": "SystemToComponentMapping",
			dst_element_id: "199c3558-e953-4e55-a3b5-967ccd67970f",
			architecture_element_id: "b0c8d460-ea74-4163-a463-f4a7aa1f3808",
		},
		{
			"@type": "ActivityToCallMapping",
			dst_element_id: "9293d8d8-02d9-4b12-b4bb-16f6cd3c8966",
			architecture_element_id: "547e0799-104e-4715-854d-d71a9542faee",
			end_correlation_id: null,
			start_correlation_id: null,
			end: null,
			is_async: false,
		},
	],
	id: "autohaus-werkstattauftrag",
};

export const readDamByDomainStoryId = async (id: string) => {
	const res = await fetch(`${backendUrl}/dam/domain-story/${id}`);
	const json = await res.json();
	console.debug(`DAM: ${json}`);
	const data: DomainArchitectureMapping = json;

	return data;
};
