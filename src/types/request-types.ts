import { Request } from "express";

export type RequestWithParams<P> = Request<P>;
export type RequestWithBody<B> = Request<Record<string, never>, unknown, B>;
export type RequestWithQuery<Q> = Request<
  Record<string, never>,
  unknown,
  unknown,
  Q
>;
export type RequestWithBodyAndQuery<B, Q> = Request<
  Record<string, never>,
  unknown,
  B,
  Q
>;

export type RequestWithParamsAndBody<P, B> = Request<P, unknown, B>;
