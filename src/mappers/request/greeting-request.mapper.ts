import { z } from "zod";

import type { GetGreetingByNameRequestDto } from "../../dtos/request/greeting/get-greeting-by-name-request.dto";
import type { GetGreetingRequestDto } from "../../dtos/request/greeting/get-greeting-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { GreetingByNameRequestParamsInput, GreetingRequestQueryInput } from "../../models/request/greeting-request.model";

const optionalNameSchema = z.string().trim().min(1).max(100);
const requiredNameSchema = z.string().trim().min(1).max(100);

export function mapGetGreetingRequest(input: GreetingRequestQueryInput, appConfig: AppConfig): GetGreetingRequestDto {
  const result = optionalNameSchema.safeParse(input.query.name);

  return {
    name: result.success ? result.data : appConfig.defaultName,
  };
}

export function mapGetGreetingByNameRequest(
  input: GreetingByNameRequestParamsInput,
): GetGreetingByNameRequestDto {
  const result = requiredNameSchema.safeParse(input.params.name);

  return {
    name: result.success ? result.data : "",
  };
}

