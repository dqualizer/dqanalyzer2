import type { PathVariable } from "./PathVariable";
import type { Payload } from "./Payload";
import type { RequestParameter } from "./RequestParameter";
import type { UrlParameter } from "./UrlParameter";

export interface Parametrization {
	path_variables?: Set<PathVariable> | null;
	url_parameter?: Set<UrlParameter> | null;
	request_parameter?: Set<RequestParameter> | null;
	payload?: Payload | null;
}