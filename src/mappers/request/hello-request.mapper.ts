import { z } from "zod";

import type { GetHelloRequestDto } from "../../dtos/request/hello/get-hello-request.dto";
import type { AppConfig } from "../../interfaces/app-config";
import type { HelloRequestQueryInput } from "../../models/request/hello-request.model";

const optionalNameSchema = z.string().trim().min(1).max(100);

export function mapGetHelloRequest(input: HelloRequestQueryInput, appConfig: AppConfig): GetHelloRequestDto {
  const result = optionalNameSchema.safeParse(input.query.name);

  return {
    name: result.success ? result.data : appConfig.defaultName,
  };
}
