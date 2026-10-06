import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "INVALID_COUPON"
  | "COUPON_EXPIRED"
  | "COUPON_LIMIT_REACHED"
  | "COUPON_MIN_ORDER_NOT_MET"
  | "DELIVERY_NOT_AVAILABLE"
  | "INVALID_ORDER_STATUS"
  | "ORDER_NOT_FOUND"
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_HAS_PRODUCTS"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR";

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

export function apiSuccess<T>(data: T, status = 200, meta?: Record<string, unknown>) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
  return NextResponse.json(body, { status });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status = 400,
  details?: unknown
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return NextResponse.json(body, { status });
}

export class AppError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}
