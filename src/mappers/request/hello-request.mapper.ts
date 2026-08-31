import type { GetHelloRequestDto } from "../../dtos/request/hello/get-hello-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { HelloRequestQueryInput } from "../../models/request/hello-request.model";
export function mapGetHelloRequest(input: HelloRequestQueryInput, appConfig: AppConfig): GetHelloRequestDto {
  const rawName = input.query.name;

  if (typeof rawName !== "string") {
    return { name: appConfig.defaultName };
  }

  const normalizedName = rawName.trim();

  return {
    name: normalizedName.length > 0 ? normalizedName : appConfig.defaultName,
  };
}
