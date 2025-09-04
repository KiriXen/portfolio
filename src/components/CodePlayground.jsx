import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const CodePlayground = () => {
  const { theme, settings } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('html');
  const [isRunning, setIsRunning] = useState(false);
  const [layout, setLayout] = useState('horizontal');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isMobile, setIsMobile] = useState(false);
  const iframeRef = useRef(null);

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()) || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [code, setCode] = useState({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Playground</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start coding to see your changes live!</p>
</body>
</html>`,
    css: `/* Add your CSS styles here */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    margin: 0;
    padding: 20px;
    background: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
}`,
    js: `// Add your JavaScript code here
console.log('Code Playground ready!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
});`
  });

  const executeCode = () => {
    setIsRunning(true);
    
    try {
      const fullHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Code Playground Result</title>
            <style>${code.css}</style>
        </head>
        <body>
            ${code.html.replace(/<!DOCTYPE html>.*?<body[^>]*>/gis, '').replace(/<\/body>.*?<\/html>/gis, '')}
            <script>${code.js}</script>
        </body>
        </html>
      `;
      
      const blob = new Blob([fullHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      if (iframeRef.current) {
        iframeRef.current.src = url;
      }
      
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setIsRunning(false);
      }, 500);
      
    } catch (err) {
      console.error('Execution error:', err);
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    setCode({
      html: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Code Playground</title>\n</head>\n<body>\n    \n</body>\n</html>',
      css: '/* Add your CSS styles here */',
      js: '// Add your JavaScript code here'
    });
  };

  const formatCode = () => {
    const currentCode = code[activeTab];
    let formatted = currentCode;
    
    if (activeTab === 'html') {
      formatted = currentCode.replace(/></g, '>\n<').replace(/^\s*\n/gm, '');
    } else if (activeTab === 'css') {
      formatted = currentCode.replace(/}/g, '}\n').replace(/{/g, ' {\n    ').replace(/;/g, ';\n    ');
    }
    
    setCode({ ...code, [activeTab]: formatted });
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  useEffect(() => {
    executeCode();
  }, []);

  const tabs = [
    { id: 'html', label: 'HTML', icon: 'fab fa-html5', color: '#e34c26' },
    { id: 'css', label: 'CSS', icon: 'fab fa-css3-alt', color: '#1572b6' },
    { id: 'js', label: 'JavaScript', icon: 'fab fa-js-square', color: '#f7df1e' }
  ];

  return (
    <>
      {/* Mobile Device Message */}
      {isMobile && (
        <div className="page-container flex items-center justify-center">
          <div className="page-content flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6 glass rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center">
                <i className="fas fa-desktop text-[var(--bg-primary)] text-2xl"></i>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold gradient-text mb-4">
                Desktop Only
              </h1>
              <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                The Code Playground requires a desktop environment for the best experience. 
                Please open this page from a PC or laptop to access the full coding interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a 
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-[var(--bg-primary)] rounded-xl font-medium hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Go Home
                </a>
                <a 
                  href="/projects"
                  className="px-6 py-3 border border-[var(--border)] text-[var(--text)] rounded-xl font-medium hover:scale-105 transition-all duration-300 hover:bg-[var(--bg-secondary)]"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Code Playground */}
      {!isMobile && (
        <div className="h-screen flex flex-col bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)] relative overflow-hidden pt-16">{/* Added top padding for header spacing */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-[var(--accent-secondary)] to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-shrink-0 glass-effect border-b border-[var(--border)]/20 backdrop-blur-xl relative z-10 shadow-lg">{/* Removed mt-16 since we have pt-16 on parent */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center p-3 sm:p-4 lg:p-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full xl:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <i className="fas fa-code text-[var(--bg-primary)] text-sm sm:text-lg"></i>
              </div>
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold gradient-text">
                  Code Playground
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
                  Build and experiment with HTML, CSS & JavaScript
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 ml-auto xl:ml-0">
              <button
                onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
                className="p-2 sm:p-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover-glow group backdrop-blur-sm"
                style={{ background: `${theme.accent}15`, border: `1px solid ${theme.accent}30` }}
                title={`Switch to ${layout === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
              >
                <i className={`fas ${layout === 'horizontal' ? 'fa-columns' : 'fa-rows'} group-hover:scale-110 transition-transform text-sm sm:text-base`} style={{ color: theme.accent }}></i>
              </button>
              
              <div className="hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg backdrop-blur-sm" style={{ background: `${theme.accent}10` }}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-medium" style={{ color: theme.accent }}>Live Preview</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
            <button
              onClick={formatCode}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover-glow backdrop-blur-sm"
              style={{ 
                background: `${theme.bgTertiary}80`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
            >
              <i className="fas fa-magic mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Format</span>
              <span className="sm:hidden">Fmt</span>
            </button>
            
            <button
              onClick={clearCode}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover-glow backdrop-blur-sm"
              style={{ 
                background: `${theme.bgTertiary}80`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
              }}
            >
              <i className="fas fa-trash mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Clear</span>
              <span className="sm:hidden">Clr</span>
            </button>
            
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl backdrop-blur-sm"
              style={{ 
                background: isRunning 
                  ? `linear-gradient(135deg, ${theme.textSecondary}, ${theme.textSecondary}80)` 
                  : `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`,
                color: theme.bgPrimary,
                boxShadow: `0 4px 20px ${theme.accent}30`
              }}
            >
              {isRunning ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Running...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Run Code</span>
                  <span className="sm:hidden">Run</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex ${layout === 'vertical' ? 'flex-col' : 'flex-col lg:flex-row'} min-h-0 gap-1 sm:gap-2 relative z-10`}>
        <div className={`${layout === 'vertical' ? 'h-1/2' : 'w-full lg:w-1/2'} flex flex-col min-h-0 glass-effect rounded-lg sm:rounded-xl m-1 sm:m-2 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
          <div className="flex-shrink-0 flex overflow-x-auto border-b border-[var(--border)]/20 scrollbar-hide" style={{ background: `${theme.bgSecondary}60` }}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-all duration-300 relative group/tab whitespace-nowrap min-w-0 ${
                  activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                }`}
                style={{
                  background: activeTab === tab.id 
                    ? `linear-gradient(135deg, ${tab.color}25, ${tab.color}15)` 
                    : 'transparent'
                }}
              >
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 transition-all duration-300 flex-shrink-0 ${
                  activeTab === tab.id ? 'scale-110 shadow-lg' : 'group-hover/tab:scale-105'
                }`} style={{ 
                  background: activeTab === tab.id ? tab.color : `${tab.color}30`,
                  color: activeTab === tab.id ? 'white' : tab.color,
                  boxShadow: activeTab === tab.id ? `0 4px 15px ${tab.color}40` : 'none'
                }}>
                  <i className={`${tab.icon} text-xs sm:text-sm`}></i>
                </div>
                
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs sm:text-sm font-bold truncate">{tab.label}</span>
                  <span className="text-xs opacity-70 hidden sm:block">
                    {tab.id === 'html' ? 'Structure' : tab.id === 'css' ? 'Styling' : 'Logic'}
                  </span>
                </div>
                
                {activeTab === tab.id && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${tab.color}, transparent)` }}
                  />
                )}
                
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  activeTab !== tab.id ? 'opacity-0 group-hover/tab:opacity-10' : 'opacity-0'
                }`} style={{ background: tab.color }}></div>
              </button>
            ))}
          </div>
          
          <div className="flex-1 min-h-0 relative overflow-hidden">
            <textarea
              value={code[activeTab]}
              onChange={(e) => setCode({ ...code, [activeTab]: e.target.value })}
              className="w-full h-full p-3 sm:p-4 lg:p-6 font-mono text-xs sm:text-sm resize-none border-none outline-none leading-relaxed transition-all duration-300 focus:ring-2 focus:ring-opacity-50"
              style={{ 
                background: `${theme.bgPrimary}95`,
                color: theme.text,
                lineHeight: '1.8',
                tabSize: '2',
                focusRingColor: theme.accent
              }}
              placeholder={`// Start coding in ${activeTab.toUpperCase()}\n// Your ${activeTab === 'html' ? 'markup' : activeTab === 'css' ? 'styles' : 'scripts'} go here...\n// Live preview will update automatically`}
              spellCheck={false}
            />
            
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 opacity-40 hover:opacity-100 transition-all duration-300">
              <div className="text-xs px-2 py-1 rounded-lg backdrop-blur-sm border border-opacity-30" style={{ 
                background: `${theme.accent}15`, 
                color: theme.accent,
                borderColor: theme.accent
              }}>
                {activeTab.toUpperCase()}
              </div>
            </div>
            
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex items-center gap-2 opacity-40 hover:opacity-100 transition-all duration-300">
              <div className="text-xs px-2 py-1 rounded-lg backdrop-blur-sm" style={{ 
                background: `${theme.bgSecondary}80`, 
                color: theme.textSecondary 
              }}>
                {code[activeTab].split('\n').length} lines
              </div>
              <div className="text-xs px-2 py-1 rounded-lg backdrop-blur-sm" style={{ 
                background: `${theme.bgSecondary}80`, 
                color: theme.textSecondary 
              }}>
                {code[activeTab].length} chars
              </div>
            </div>
            
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 flex items-center gap-2 opacity-40 hover:opacity-100 transition-all duration-300">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: tabs.find(t => t.id === activeTab)?.color }}></div>
              <div className="text-xs" style={{ color: theme.textSecondary }}>
                Live Editing
              </div>
            </div>
          </div>
        </div>

        <div className={`${layout === 'vertical' ? 'h-1/2' : 'w-full lg:w-1/2'} flex flex-col min-h-0 glass-effect rounded-lg sm:rounded-xl m-1 sm:m-2 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group`}>
          <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b border-[var(--border)]/20 gap-3 sm:gap-0" style={{ background: `${theme.bgSecondary}60` }}>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                <i className="fas fa-eye text-white text-xs sm:text-sm"></i>
              </div>
              <div className="flex-1 sm:flex-initial">
                <h3 className="font-bold text-sm sm:text-base text-[var(--text)]">Live Preview</h3>
                <p className="text-xs text-[var(--text-secondary)]">Real-time output</p>
              </div>
              
              <div className="flex sm:hidden items-center gap-1">
                {['desktop', 'tablet', 'mobile'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`p-1.5 rounded-lg text-xs transition-all duration-300 hover:scale-105 ${
                      previewMode === mode 
                        ? 'text-white shadow-lg' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                    }`}
                    style={{ 
                      background: previewMode === mode 
                        ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`
                        : `${theme.bgTertiary}40`
                    }}
                    title={`${mode} view`}
                  >
                    <i className={`fas ${
                      mode === 'desktop' ? 'fa-desktop' : 
                      mode === 'tablet' ? 'fa-tablet-alt' : 
                      'fa-mobile-alt'
                    }`}></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-1">
                {['desktop', 'tablet', 'mobile'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`p-2 rounded-lg text-xs transition-all duration-300 hover:scale-105 group/btn relative ${
                      previewMode === mode 
                        ? 'text-white shadow-lg' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
                    }`}
                    style={{ 
                      background: previewMode === mode 
                        ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentSecondary})`
                        : `${theme.bgTertiary}40`
                    }}
                    title={`${mode} view`}
                  >
                    <i className={`fas ${
                      mode === 'desktop' ? 'fa-desktop' : 
                      mode === 'tablet' ? 'fa-tablet-alt' : 
                      'fa-mobile-alt'
                    } transition-transform group-hover/btn:scale-110`}></i>
                    
                    {previewMode === mode && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }}></div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="ml-2 flex items-center gap-2">
                <div className="text-xs font-mono px-2 py-1 rounded-lg backdrop-blur-sm" style={{ 
                  background: `${theme.accent}15`, 
                  color: theme.accent,
                  border: `1px solid ${theme.accent}30`
                }}>
                  {getPreviewWidth()}
                </div>
                
                <div className="text-xs px-2 py-1 rounded-lg backdrop-blur-sm" style={{ 
                  background: `${theme.bgTertiary}60`, 
                  color: theme.textSecondary 
                }}>
                  {previewMode}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-0 flex justify-center items-center p-2 sm:p-4 relative overflow-hidden" style={{ background: `${theme.bgTertiary}20` }}>
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.accent}40 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${theme.accentSecondary}40 0%, transparent 50%)`,
              backgroundSize: '100px 100px'
            }}></div>
            
            <div 
              className="h-full transition-all duration-500 shadow-2xl relative overflow-hidden group/preview"
              style={{ 
                width: getPreviewWidth(),
                maxWidth: '100%'
              }}
            >
              {previewMode !== 'desktop' && (
                <div className="absolute inset-0 pointer-events-none z-10">
                  <div 
                    className="w-full h-full rounded-lg border-2 shadow-inner"
                    style={{ 
                      borderColor: theme.accent,
                      background: `linear-gradient(45deg, transparent, ${theme.accent}05, transparent)`
                    }}
                  >
                    {previewMode === 'mobile' && (
                      <div 
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-b-lg"
                        style={{ background: theme.bgPrimary }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
              
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0 rounded-lg overflow-hidden transition-all duration-500 group-hover/preview:shadow-2xl"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
                style={{ 
                  background: 'white',
                  boxShadow: previewMode !== 'desktop' 
                    ? `0 20px 60px ${theme.accent}25, inset 0 0 0 1px ${theme.accent}20` 
                    : `0 10px 40px ${theme.bgPrimary}30`,
                  transform: 'translateZ(0)'
                }}
              />
              
              {isRunning && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-lg" style={{ background: `${theme.bgPrimary}80` }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: theme.accent, borderTopColor: 'transparent' }}></div>
                    <div className="text-sm font-medium" style={{ color: theme.accent }}>
                      Executing code...
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 left-2 flex items-center gap-2 opacity-0 group-hover/preview:opacity-100 transition-all duration-300">
                <div className="text-xs px-2 py-1 rounded-lg backdrop-blur-sm border border-opacity-30" style={{ 
                  background: `${theme.bgSecondary}90`, 
                  color: theme.text,
                  borderColor: theme.border
                }}>
                  {previewMode} preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      )}
    </>
  );
};

export default CodePlayground;