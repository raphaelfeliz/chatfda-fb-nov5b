import { ResetButton } from './restart-button';
import { Breadcrumb } from './breadcrumb';

type ProgressTrackerProps = {
  history: string[];
  onReset: () => void;
};

export function ProgressTracker({ history, onReset }: ProgressTrackerProps) {
  return (
    <div
      className="flex items-center justify-between flex-wrap gap-2 md:gap-4"
    >
      <ResetButton onReset={onReset} />
      <Breadcrumb history={history} />
    </div>
  );
}
