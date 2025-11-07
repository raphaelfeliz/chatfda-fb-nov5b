/*
*file-summary*
PATH: src/components/header/progress-tracker.tsx
PURPOSE: Combine breadcrumb navigation and reset control into a unified progress-tracking header for the configurator flow.
SUMMARY: Renders a ResetButton for restarting and a Breadcrumb for showing decision history, styled with a responsive flex layout.
IMPORTS: ResetButton (from ./restart-button), Breadcrumb (from ./breadcrumb)
EXPORTS: ProgressTracker (React functional component)
*/


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
