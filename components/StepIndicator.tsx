import { Fragment } from 'react';

interface Props {
  current: 'member' | 'boat' | 'return';
}

const steps = ['member', 'boat', 'return'] as const;
const labels: Record<(typeof steps)[number], string> = {
  member: 'Member',
  boat: 'Boat',
  return: 'Return',
};

export default function StepIndicator({ current }: Props) {
  return (
    <div className="steps">
      {steps.map((step, i) => (
        <Fragment key={step}>
          {i > 0 && <i />}
          <span className={step === current ? 'cur' : ''}>{labels[step]}</span>
        </Fragment>
      ))}
    </div>
  );
}
