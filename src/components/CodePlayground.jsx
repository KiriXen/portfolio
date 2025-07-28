import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const CodePlayground = () => {
  const { theme, settings } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('html');
  const [isRunning, setIsRunning] = useState(false);
  const [layout, setLayout] = useState('horizontal');
  const [previewMode, setPreviewMode] = useState('desktop');
  const iframeRef = useRef(null);
  
  const [code, setCode] = useState({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Welcome to Code Playground</h1>
            <p>Edit HTML, CSS, and JavaScript to see live results!</p>
        </header>
        
        <main>
            <div class="card">
                <h2>Interactive Demo</h2>
                <button id="colorBtn">Change Color</button>
                <div id="output">Click the button above!</div>
            </div>
            
            <div class="stats">
                <div class="stat-item">
                    <span class="number" id="counter">0</span>
                    <span class="label">Clicks</span>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`,
    css: `/* Modern CSS Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
}

header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

.card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border: 1px solid rgba(255,255,255,0.2);
}

.card h2 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

#colorBtn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

#colorBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255,107,107,0.4);
}

#output {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    font-weight: 500;
    color: #333;
}

.stats {
    display: flex;
    justify-content: center;
}

.stat-item {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #667eea;
}

.label {
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

@media (max-width: 768px) {
    header h1 {
        font-size: 2rem;
    }
    
    .card {
        padding: 1.5rem;
    }
}`,
    js: `// Interactive JavaScript
let clickCount = 0;
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8'];
let currentColorIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    const colorBtn = document.getElementById('colorBtn');
    const output = document.getElementById('output');
    const counter = document.getElementById('counter');
    
    colorBtn.addEventListener('click', function() {
        clickCount++;
        currentColorIndex = (currentColorIndex + 1) % colors.length;
        
        counter.textContent = clickCount;
        counter.style.transform = 'scale(1.2)';
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
        }, 200);
        
        const newColor = colors[currentColorIndex];
        output.style.background = newColor + '20';
        output.style.borderLeftColor = newColor;
        output.textContent = \`Awesome! Color changed to \${newColor} 🎨\`;
        
        colorBtn.style.background = \`linear-gradient(45deg, \${newColor}, \${colors[(currentColorIndex + 1) % colors.length]})\`;
        
        createSparkle(colorBtn);
    });
    
    function createSparkle(element) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = \`
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkle 0.6s ease-out forwards;
        \`;
        
        const rect = element.getBoundingClientRect();
        sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 600);
    }
    
    const style = document.createElement('style');
    style.textContent = \`
        @keyframes sparkle {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            100% { transform: scale(1) rotate(180deg); opacity: 0; }
        }
    \`;
    document.head.appendChild(style);
    
    console.log('🎉 Code Playground is ready!');
});`
  });

  const presetExamples = [
    {
      name: 'Interactive Card',
      html: code.html,
      css: code.css,
      js: code.js
    },
    {
      name: 'Todo List',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List</title>
</head>
<body>
    <div class="app">
        <h1>📝 My Todo List</h1>
        <div class="input-container">
            <input type="text" id="todoInput" placeholder="Add a new task...">
            <button id="addBtn">Add</button>
        </div>
        <ul id="todoList"></ul>
        <div class="stats">
            <span>Total: <span id="total">0</span></span>
            <span>Completed: <span id="completed">0</span></span>
        </div>
    </div>
</body>
</html>`,
      css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #74b9ff, #0984e3);
    margin: 0;
    padding: 20px;
    min-height: 100vh;
}

.app {
    max-width: 500px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

h1 {
    text-align: center;
    color: #2d3436;
    margin-bottom: 2rem;
}

.input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 2rem;
}

#todoInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

#addBtn {
    padding: 12px 20px;
    background: #00b894;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
}

#addBtn:hover {
    background: #00a085;
}

#todoList {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
}

.todo-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    margin-bottom: 8px;
    border-radius: 8px;
    border-left: 4px solid #74b9ff;
}

.todo-item.completed {
    text-decoration: line-through;
    opacity: 0.6;
    border-left-color: #00b894;
}

.todo-item input[type="checkbox"] {
    margin-right: 12px;
}

.todo-item .delete-btn {
    margin-left: auto;
    background: #e17055;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
}

.stats {
    display: flex;
    justify-content: space-between;
    color: #636e72;
    font-weight: 500;
}`,
      js: `let todos = [];
let nextId = 1;

document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    
    function addTodo() {
        const text = todoInput.value.trim();
        if (!text) return;
        
        const todo = {
            id: nextId++,
            text: text,
            completed: false
        };
        
        todos.push(todo);
        todoInput.value = '';
        renderTodos();
    }
    
    function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            renderTodos();
        }
    }
    
    function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    }
    
    function renderTodos() {
        todoList.innerHTML = '';
        
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (todo.completed ? ' completed' : '');
            li.innerHTML = \`
                <input type="checkbox" \${todo.completed ? 'checked' : ''} 
                       onchange="toggleTodo(\${todo.id})">
                <span>\${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(\${todo.id})">×</button>
            \`;
            todoList.appendChild(li);
        });
        
        updateStats();
    }
    
    function updateStats() {
        document.getElementById('total').textContent = todos.length;
        document.getElementById('completed').textContent = todos.filter(t => t.completed).length;
    }
    
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;
});`
    }
  ];

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

  const loadExample = (example) => {
    setCode({
      html: example.html,
      css: example.css,
      js: example.js
    });
  };

  const resetCode = () => {
    setCode({
      html: '',
      css: '',
      js: ''
    });
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
    <div className="h-screen flex flex-col" style={{ background: theme.bgPrimary }}>
      {/* Header */}
      <div className="flex-shrink-0 border-b" style={{ borderColor: theme.border, background: theme.bgSecondary }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold" style={{ color: theme.text }}>
              <i className="fas fa-code mr-2" style={{ color: theme.accent }}></i>
              Code Playground
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout(layout === 'horizontal' ? 'vertical' : 'horizontal')}
                className="p-2 rounded-lg text-sm transition-all hover:scale-105"
                style={{ background: theme.accent + '20', color: theme.accent }}
                title={`Switch to ${layout === 'horizontal' ? 'vertical' : 'horizontal'} layout`}
              >
                <i className={`fas ${layout === 'horizontal' ? 'fa-columns' : 'fa-rows'}`}></i>
              </button>
              <div className="hidden sm:flex items-center gap-1 text-xs" style={{ color: theme.textSecondary }}>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Live Preview
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <select 
              onChange={(e) => loadExample(presetExamples[e.target.value])}
              className="px-3 py-1 rounded-lg text-sm border-0 outline-none"
              style={{ background: theme.accent, color: theme.bgPrimary }}
            >
              <option value="">Load Example</option>
              {presetExamples.map((example, index) => (
                <option key={index} value={index}>{example.name}</option>
              ))}
            </select>
            
            <button
              onClick={resetCode}
              className="px-3 py-1 rounded-lg text-sm transition-all hover:scale-105"
              style={{ background: theme.bgTertiary, color: theme.text }}
            >
              <i className="fas fa-refresh mr-1"></i>
              Reset
            </button>
            
            <button
              onClick={executeCode}
              disabled={isRunning}
              className="px-4 py-1 rounded-lg text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
              style={{ 
                background: isRunning ? theme.textSecondary : theme.accent,
                color: theme.bgPrimary
              }}
            >
              {isRunning ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i>
                  Running...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-1"></i>
                  Run Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex ${layout === 'vertical' ? 'flex-col' : 'flex-col lg:flex-row'} min-h-0`}>
        {/* Editor Panel */}
        <div className={`${layout === 'vertical' ? 'h-1/2' : 'w-full lg:w-1/2'} flex flex-col min-h-0`}>
          {/* Tabs */}
          <div className="flex-shrink-0 flex border-b" style={{ borderColor: theme.border, background: theme.bgSecondary }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all hover:bg-opacity-80 ${
                  activeTab === tab.id 
                    ? 'border-b-2 bg-opacity-20' 
                    : 'hover:bg-opacity-10'
                }`}
                style={{
                  color: activeTab === tab.id ? tab.color : theme.text,
                  borderBottomColor: activeTab === tab.id ? tab.color : 'transparent',
                  backgroundColor: activeTab === tab.id ? tab.color + '10' : 'transparent'
                }}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 min-h-0">
            <textarea
              value={code[activeTab]}
              onChange={(e) => setCode({ ...code, [activeTab]: e.target.value })}
              className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none"
              style={{ 
                background: theme.bgPrimary,
                color: theme.text,
                lineHeight: '1.6'
              }}
              placeholder={`Write your ${activeTab.toUpperCase()} code here...`}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${layout === 'vertical' ? 'h-1/2' : 'w-full lg:w-1/2'} flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l`} style={{ borderColor: theme.border }}>
          {/* Preview Header */}
          <div className="flex-shrink-0 flex justify-between items-center p-3 border-b" style={{ borderColor: theme.border, background: theme.bgSecondary }}>
            <div className="flex items-center gap-2">
              <h3 className="font-medium" style={{ color: theme.text }}>Preview</h3>
              <div className="hidden sm:flex items-center gap-1">
                {['desktop', 'tablet', 'mobile'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`p-1 rounded text-xs transition-all ${previewMode === mode ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}
                    style={{ color: theme.accent }}
                    title={`${mode} view`}
                  >
                    <i className={`fas ${mode === 'desktop' ? 'fa-desktop' : mode === 'tablet' ? 'fa-tablet-alt' : 'fa-mobile-alt'}`}></i>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              {previewMode} • {getPreviewWidth()}
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="flex-1 min-h-0 flex justify-center" style={{ background: theme.bgTertiary }}>
            <div 
              className="h-full"
              style={{ 
                width: getPreviewWidth(),
                maxWidth: '100%'
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Code Preview"
                style={{ 
                  background: 'white',
                  borderRadius: previewMode !== 'desktop' ? '8px' : '0'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;