import type { GetGreetingByNameRequestDto } from "../../dtos/request/greeting/get-greeting-by-name-request.dto";
import type { GetGreetingRequestDto } from "../../dtos/request/greeting/get-greeting-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { GreetingByNameRequestParamsInput, GreetingRequestQueryInput } from "../../models/request/greeting-request.model";

export function mapGetGreetingRequest(input: GreetingRequestQueryInput, appConfig: AppConfig): GetGreetingRequestDto {
  const rawName = input.query.name;

  if (typeof rawName !== "string") {
    return { name: appConfig.defaultName };
  }

  const normalizedName = rawName.trim();

  return {
    name: normalizedName.length > 0 ? normalizedName : appConfig.defaultName,
  };
}

export function mapGetGreetingByNameRequest(
  input: GreetingByNameRequestParamsInput,
): GetGreetingByNameRequestDto {
  return {
    name: input.params.name.trim(),
  };
}

