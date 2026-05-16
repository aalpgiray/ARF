'use client';

type Step = 'upload' | 'review' | 'done';

export default function WizardSteps({ step }: { step: Step }) {
  const order = ['upload', 'review', 'done'] as const;
  const done = (s: Step) => order.indexOf(step) > order.indexOf(s);
  const cur = (s: Step) => step === s;

  return (
    <div className="wizard-steps">
      <span className={`s${done('upload') ? ' done' : cur('upload') ? ' cur' : ''}`}>
        <span className="n">{done('upload') ? '✓' : '1'}</span>Upload
      </span>
      <i />
      <span className={`s${done('review') ? ' done' : cur('review') ? ' cur' : ''}`}>
        <span className="n">{done('review') ? '✓' : '2'}</span>Review
      </span>
      <i />
      <span className={`s${cur('done') ? ' cur' : ''}`}>
        <span className="n">3</span>Apply
      </span>
    </div>
  );
}
