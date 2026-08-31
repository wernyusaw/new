export type ValueChangeOperation = "increase" | "decrease";

export interface CalculateValueChangeRequestDto {
  currentValue: number;
  changeBy: number;
  operation: ValueChangeOperation;
}
