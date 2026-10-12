export type PickerTarget = "pickup" | "return";

export type CarSearchLabels = {
  button: string;
  criteriaModeLabel: string;
  freeTextHelper?: string;
  freeTextLabel: string;
  freeTextModeLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  locationLabel: string;
  locationRequired: string;
  returnLocationLabel: string;
  returnLocationRequired: string;
  pickupDateLabel: string;
  placeholder: string;
  returnDateLabel: string;
};

export type CarSearchDateTimeFieldsProps = {
  pickupAt: string;
  returnAt: string;
  pickupDateLabel: string;
  returnDateLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  openPicker: PickerTarget | null;
  onOpenPickerChange: (target: PickerTarget | null) => void;
  onPickupAtChange: (value: string) => void;
  onReturnAtChange: (value: string) => void;
  onPickupErrorChange?: (hasError: boolean) => void;
  onReturnErrorChange?: (hasError: boolean) => void;
  showRequiredErrors: boolean;
};
