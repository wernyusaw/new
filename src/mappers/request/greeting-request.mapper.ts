import type { GetGreetingByNameRequestDto } from "../../dtos/request/greeting/get-greeting-by-name-request.dto";
import type { GetGreetingRequestDto } from "../../dtos/request/greeting/get-greeting-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { GreetingByNameRequestParamsInput, GreetingRequestQueryInput } from "../../models/request/greeting-request.model";
import { getGreetingByNameSchema } from "../../schemas/request/greeting/get-greeting-by-name.schema";
import { getGreetingNameSchema } from "../../schemas/request/greeting/get-greeting.schema";

export function mapGetGreetingRequest(input: GreetingRequestQueryInput, appConfig: AppConfig): GetGreetingRequestDto {
  const result = getGreetingNameSchema.safeParse(input.query.name);

  return {
    name: result.success ? result.data : appConfig.defaultName,
  };
}

export function mapGetGreetingByNameRequest(
  input: GreetingByNameRequestParamsInput,
): GetGreetingByNameRequestDto {
  const result = getGreetingByNameSchema.safeParse(input.params.name);

  return {
    name: result.success ? result.data : "",
  };
}

