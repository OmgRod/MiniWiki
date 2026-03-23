import { Highlight, themes } from 'prism-react-renderer';
import { useEffect, useState } from 'react';

function getCodeString(children) {
  if (!children) {
    return '';
  }

  if (typeof children === 'string') {
    return children;
  }

  if (children.props?.children) {
    return children.props.children;
  }

  return '';
}

function getLanguage(className = '') {
  const match = className.match(/language-([a-zA-Z0-9]+)/);
  return match?.[1] || 'text';
}

function normalizeCode(value = '') {
  const lines = value.replace(/\r\n/g, '\n').split('\n');

  while (lines.length && lines[0].trim() === '') {
    lines.shift();
  }

  while (lines.length && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  return lines.join('\n');
}

export default function CodeBlock({ children, className = '' }) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') {
      return true;
    }

    return document.documentElement.classList.contains('dark');
  });
  const code = normalizeCode(getCodeString(children));
  const language = getLanguage(className || children?.props?.className);

  useEffect(() => {
    function syncTheme() {
      setIsDark(document.documentElement.classList.contains('dark'));
    }

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  if (!code) {
    return null;
  }

  async function handleCopy() {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch (_error) {
      setCopied(false);
    }
  }

  return (
    <div className={`my-6 overflow-hidden rounded-xl border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
      <div
        className={`flex items-center justify-between border-b px-4 py-2 text-xs uppercase tracking-wide ${
          isDark
            ? 'border-slate-700 bg-slate-800 text-slate-300'
            : 'border-slate-300 bg-slate-100 text-slate-700'
        }`}
      >
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`rounded border px-2.5 py-1 text-[11px] font-medium tracking-normal transition ${
            isDark
              ? 'border-slate-600 text-slate-200 hover:bg-slate-700'
              : 'border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight code={code} language={language} theme={isDark ? themes.vsDark : themes.vsLight}>
        {({ className: highlightedClassName, style, tokens, getLineProps, getTokenProps }) => (
          <div className="p-3" style={{ backgroundColor: style.backgroundColor }}>
            <pre
              className={`${highlightedClassName} !m-0 overflow-x-auto text-sm leading-7`}
              style={{ ...style, backgroundColor: 'transparent', margin: 0, padding: 0 }}
            >
              {tokens.map((line, index) => (
                <div key={index} {...getLineProps({ line })}>
                  {line.map((token, tokenKey) => (
                    <span key={tokenKey} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
}
