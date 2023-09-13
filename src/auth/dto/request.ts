import { CapacitorHttp, HttpOptions } from "@capacitor/core";
import { Method } from "src/enum/method";
import { snakecaseKeys } from "src/utils/snakecase_keys";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResponseType {}
export type Headers = Record<string, string>;
export type Parameters =
  | URLSearchParams
  | undefined
  | Record<string, string | number | undefined | Record<string, string | number | undefined>>;

export interface RequestType {
  readonly baseURL: string;
  readonly headers: Headers;
  readonly method: Method;
  readonly parameters: Parameters;
  readonly path: string;

  request(response: any): ResponseType | void;
}

export async function request<T extends RequestType, U extends ReturnType<T["request"]>>(request: T): Promise<U> {
  const url = new URL(request.path, request.baseURL);
  if (request.method === Method.GET) {
    url.search = new URLSearchParams(request.parameters as Record<string, string>).toString();
  }
  const body = request.method === Method.GET ? undefined : JSON.stringify(request.parameters);
  const options: HttpOptions = {
    data: body,
    headers: request.headers,
    method: request.method,
    responseType: "json",
    url: url.href,
  };
  const response = await CapacitorHttp.request(options);

  if (response.status !== 200 && response.status !== 201) {
    console.error(request);
    console.error(JSON.stringify(response.data));
    throw new Error(`Request failed with status code ${response.status}`);
  }
  return request.request(snakecaseKeys(response.data)) as U;
}
