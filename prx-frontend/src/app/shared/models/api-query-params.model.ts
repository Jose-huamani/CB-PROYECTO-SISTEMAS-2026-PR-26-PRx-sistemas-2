export type ApiQueryParamPrimitive = string | number | boolean;

export type ApiQueryParamValue =
  | ApiQueryParamPrimitive
  | ApiQueryParamPrimitive[]
  | null
  | undefined;

export type ApiQueryParamsModel = Record<string, ApiQueryParamValue>;
