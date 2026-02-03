import { NextResponse } from 'next/server';

type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
};

export function successResponse<T>(data: T, status: number = 200, headers?: HeadersInit) {
  return NextResponse.json(
    { success: true, data },
    { status, headers }
  );
}

export function errorResponse(message: string, status: number = 500, details?: any) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  );
}
