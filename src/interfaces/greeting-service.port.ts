import type { GetGreetingByNameRequestDto } from "../dtos/request/greeting/get-greeting-by-name-request.dto";
import type { GetGreetingRequestDto } from "../dtos/request/greeting/get-greeting-request.dto";

export interface GreetingServicePort {
  getGreetingByName(input: GetGreetingByNameRequestDto): Promise<string | null>;
  buildMessage(input: GetGreetingRequestDto): Promise<string>;
}
