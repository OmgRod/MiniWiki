import MathEquation from './MathEquation';
import Steps from '../Steps';

const FALLBACK_STEPS = [
  { label: 'Start from the quadratic equation', expression: 'ax^2 + bx + c = 0' },
  { label: 'Normalize by a', expression: 'x^2 + \\frac{b}{a}x + \\frac{c}{a} = 0' },
  { label: 'Solve for x', expression: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
];

function parseSteps(steps) {
  if (Array.isArray(steps)) {
    return steps;
  }

  if (steps && typeof steps === 'object') {
    if (Array.isArray(steps.steps)) {
      return steps.steps;
    }

    return Object.values(steps).filter(Boolean);
  }

  if (typeof steps === 'string' && steps.trim()) {
    try {
      const parsed = JSON.parse(steps);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return [];
    }
  }

  return [];
}

export default function MathSteps({ steps = [], className = '' }) {
  const normalizedSteps = parseSteps(steps).filter((step) => step && typeof step === 'object');
  const displaySteps = normalizedSteps.length ? normalizedSteps : FALLBACK_STEPS;
  const stepItems = displaySteps.map((step, index) => (
    <div key={`math-step-content-${index}`}>
      {step?.label ? <p className="mb-2 text-sm text-slate-700 dark:text-slate-200">{step.label}</p> : null}
      <MathEquation expression={step?.expression || ''} />
    </div>
  ));

  return (
    <div className={className}>
      <Steps items={stepItems} />
    </div>
  );
}
