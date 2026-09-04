import type { GetHelloRequestDto } from "../../dtos/request/hello/get-hello-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { HelloRequestQueryInput } from "../../models/request/hello-request.model";
import { getHelloNameSchema } from "../../schemas/request/hello/get-hello.schema";

export function mapGetHelloRequest(input: HelloRequestQueryInput, appConfig: AppConfig): GetHelloRequestDto {
  const result = getHelloNameSchema.safeParse(input.query.name);

  return {
    name: result.success ? result.data : appConfig.defaultName,
  };
}
