import { useCourseProgress } from "../../shared/hooks/useCourseProgress";

export default function usePowerShellProgress() {
  return useCourseProgress("powershell");
}
