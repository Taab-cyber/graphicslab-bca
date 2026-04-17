import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import type { ProgramData } from '../../types';

interface TheCodeProps {
  program: ProgramData;
}

export default function TheCode({ program }: TheCodeProps) {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [copied, setCopied] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleRunCode = () => {
    setShowTerminal(true);
    setCompiling(true);
    setCompiled(false);
    setTimeout(() => {
      setCompiling(false);
      setCompiled(true);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(program.cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorMount = (editor: any) => {
    // Highlight key lines
    const decorations = program.keyLines.map(line => ({
      range: { startLineNumber: line, startColumn: 1, endLineNumber: line, endColumn: 1 },
      options: {
        isWholeLine: true,
        className: 'key-line-highlight',
        glyphMarginClassName: 'key-line-glyph',
        linesDecorationsClassName: 'key-line-decoration',
      },
    }));
    editor.deltaDecorations([], decorations);

    editor.onMouseDown((e: any) => {
      if (e.target.position) {
        setSelectedLine(e.target.position.lineNumber);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Code Editor */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold" style={{ color: '#00B4D8' }}>💻 C++ Code</span>
              <span
                className="text-sm px-3 py-1 rounded-full font-mono"
                style={{ background: '#7B2FBE30', color: '#7B2FBE' }}
              >
                {program.complexity}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs rounded-lg transition-all"
                style={{ background: '#161B22', border: '1px solid #30363D', color: copied ? '#3FB950' : '#E6EDF3' }}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                onClick={handleRunCode}
                className="px-4 py-1.5 text-xs rounded-lg font-medium transition-all"
                style={{ background: '#3FB950', color: '#0D1117' }}
              >
                ▶ Run Code
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #30363D' }}>
            <Editor
              height="400px"
              language="cpp"
              value={program.cppCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                renderLineHighlight: 'all',
                padding: { top: 12 },
                glyphMargin: true,
              }}
              onMount={handleEditorMount}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:w-80 space-y-6">
          {/* Line explanation */}
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <h4 className="text-base font-bold mb-3" style={{ color: '#D29922' }}>
              {selectedLine ? `📝 Line ${selectedLine}` : '📝 Click a line for explanation'}
            </h4>
            <AnimatePresence mode="wait">
              {selectedLine && program.lineExplanations[selectedLine] && (
                <motion.p
                  key={selectedLine}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm leading-relaxed"
                  style={{ color: '#8B949E' }}
                >
                  {program.lineExplanations[selectedLine]}
                </motion.p>
              )}
              {selectedLine && !program.lineExplanations[selectedLine] && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm italic"
                  style={{ color: '#6B7280' }}
                >
                  Standard C/C++ syntax — no special explanation needed.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Algorithm steps */}
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <h4 className="text-base font-bold mb-4" style={{ color: '#00B4D8' }}>📋 Algorithm Steps</h4>
            <div className="space-y-4">
              {program.algorithmSteps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                    style={{ background: '#00B4D830', color: '#00B4D8' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed" style={{ color: '#8B949E' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Key lines legend */}
          <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
            <h4 className="text-base font-bold mb-3" style={{ color: '#3FB950' }}>⭐ Key Lines</h4>
            <div className="flex flex-wrap gap-2">
              {program.keyLines.map(line => (
                <span
                  key={line}
                  onClick={() => setSelectedLine(line)}
                  className="px-3 py-1 rounded-md text-sm font-mono cursor-pointer transition-colors hover:bg-[#3FB95030]"
                  style={{ background: '#0D1117', color: '#3FB950', border: '1px solid #3FB95040' }}
                >
                  L{line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fake Terminal */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            ref={terminalRef}
            className="rounded-xl overflow-hidden"
            style={{ background: '#0D1117', border: '1px solid #30363D' }}
          >
            <div className="flex items-center gap-2 px-4 py-2" style={{ background: '#161B22', borderBottom: '1px solid #30363D' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#F85149' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#D29922' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#3FB950' }} />
              <span className="text-xs ml-2 font-mono" style={{ color: '#8B949E' }}>Terminal</span>
              <button
                onClick={() => setShowTerminal(false)}
                className="ml-auto text-xs hover:text-white"
                style={{ color: '#8B949E' }}
              >
                ✕
              </button>
            </div>

            <div className="p-4 font-mono text-sm space-y-1">
              <div style={{ color: '#8B949E' }}>$ g++ {program.shortTitle.toLowerCase().replace(/ /g, '_')}.cpp -o output -lgraph</div>

              {compiling && (
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ color: '#D29922' }}
                >
                  ⏳ Compiling...
                </motion.div>
              )}

              {compiled && (
                <>
                  <div style={{ color: '#3FB950' }}>✓ Compilation successful</div>
                  <div style={{ color: '#8B949E' }}>$ ./output</div>
                  <div style={{ color: '#3FB950' }}>
                    Output: Graphics window opened — {program.title} drawn successfully! ✨
                  </div>
                  <div style={{ color: '#00B4D8' }} className="mt-2">
                    [Graphics window is simulated in the "See It Live" tab above ☝️]
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
