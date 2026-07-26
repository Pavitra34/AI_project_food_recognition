const MIN_BMI = 15;
const MAX_BMI = 40;
const UNDER_MAX = 18.5;
const NORMAL_MAX = 25;

export const BMI_RANGES = {
  min: MIN_BMI,
  max: MAX_BMI,
  underMax: UNDER_MAX,
  normalMax: NORMAL_MAX,
};

export const getBMIPosition = (bmi?: number | null): number => {
  if (!bmi) {
    return 0;
  }

  const clamped = Math.min(Math.max(bmi, MIN_BMI), MAX_BMI);
  return ((clamped - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100;
};

export const getBMISegmentWidths = () => {
  const range = MAX_BMI - MIN_BMI;

  return {
    under: ((UNDER_MAX - MIN_BMI) / range) * 100,
    normal: ((NORMAL_MAX - UNDER_MAX) / range) * 100,
    over: ((MAX_BMI - NORMAL_MAX) / range) * 100,
  };
};

export const calculateBMI = (
  weight?: number | null,
  height?: number | null
): number | null => {
  if (!weight || !height) {
    return null;
  }

  const heightM = height / 100;
  return Number((weight / (heightM * heightM)).toFixed(1));
};

export const getBMICategory = (bmi?: number | null): string => {
  if (!bmi) {
    return "Not Set";
  }

  if (bmi < UNDER_MAX) {
    return "Underweight";
  }

  if (bmi < NORMAL_MAX) {
    return "Normal";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
};

export const getBMIBadgeStyle = (category?: string | null) => {
  switch (category) {
    case "Underweight":
      return { backgroundColor: "#FEF9C3", color: "#A16207" };
    case "Normal":
      return { backgroundColor: "#E6F8F6", color: "#0F8A83" };
    case "Overweight":
      return { backgroundColor: "#FFEDD5", color: "#C2410C" };
    case "Obese":
      return { backgroundColor: "#FEE2E2", color: "#DC2626" };
    default:
      return { backgroundColor: "#F3F4F6", color: "#6B7280" };
  }
};
