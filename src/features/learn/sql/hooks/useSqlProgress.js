import { useCourseProgress } from "../../shared/hooks/useCourseProgress";

export default function useSqlProgress() {
  return useCourseProgress("sql");
}
