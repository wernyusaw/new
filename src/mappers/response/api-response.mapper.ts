export interface ApiResponseEnvelope<T> {
  resultCode: number;
  resultMessage: string;
  resultData?: T;
}

export function mapSuccessResponse<T>(resultCode: number, resultData: T, resultMessage = "success"): ApiResponseEnvelope<T> {
  return {
    resultCode,
    resultMessage,
    resultData,
  };
}

export function mapErrorResponse(resultCode: number, resultMessage: string): ApiResponseEnvelope<never> {
  return {
    resultCode,
    resultMessage,
  };
}
