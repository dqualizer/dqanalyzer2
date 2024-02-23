import { PathVariable } from "./PathVariable";
import { Payload } from "./Payload";
import { RequestParameter } from "./RequestParameter";
import { UrlParameter } from "./UrlParameter";

export interface Parametrization {
	path_variables?: Set<PathVariable> | null;
	url_parameter?: Set<UrlParameter> | null;
	request_parameter?: Set<RequestParameter> | null;
	payload?: Payload | null;
}