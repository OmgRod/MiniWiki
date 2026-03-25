import katex from 'katex';

function renderExpression(expression, isBlock) {
  try {
    return katex.renderToString(expression, {
      throwOnError: false,
      displayMode: isBlock,
      strict: 'ignore',
    });
  } catch {
    return katex.renderToString('\\text{Invalid equation}', {
      throwOnError: false,
      displayMode: isBlock,
      strict: 'ignore',
    });
  }
}

export default function MathEquation({
  expression = '',
  block = true,
  className = '',
}) {
  const html = renderExpression(String(expression || ''), block);
  const wrapperClass = block
    ? `my-4 overflow-x-auto rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 ${className}`
    : className;

  const Element = block ? 'div' : 'span';

  return <Element className={wrapperClass} dangerouslySetInnerHTML={{ __html: html }} />;
}
