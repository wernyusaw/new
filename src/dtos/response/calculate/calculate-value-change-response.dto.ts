import type { ValueChangeOperation } from "../../request/calculate/calculate-value-change-request.dto";

export interface CalculateValueChangeResponseDto {
  operation: ValueChangeOperation;
  originalValue: number;
  changeBy: number;
  changedValue: number;
}
