import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const MemoryVisualizer = () => {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('primitive');

  const [variables, setVariables] = useState({
    primitive: {
      age: {val:'25',mem:'25',editable:true},
      name: {val:'"Alice"',mem:'"Alice"',editable:true},
      nameTwo: {val:'name;',mem:'"Alice"'},
      isActive: {val:'true',mem:'true',editable:true},
      empty: {val:'null',mem:'null',editable:true},
      temp: {val:'undefined',mem:'undefined',editable:true},
    },
    reference: {
      user: {
        name: {val:'"Bob"',mem:'"Bob"'},
        age: {val:'30',mem:'30'},
      },
      numbers: {val:'[1, 2, 3, 4, 5]',mem:'[1, 2, 3, 4, 5]'},
      numbersTwo: {val:'numbers',mem:'numbers'},
      deepCopy: {val:'structuredClone(numbers)',mem:'[1, 2, 3, 4, 5]'},
    },
    complex: {
      app: {
        name: '"App"',
        config: {
          theme: '"dark"',
          users: [
            {
              id: '1',
              name: '"Alice"',
            },
          ],
        },
      },
    },
  });

  const generateHeapAddress = () => {
    return '0x' + Math.floor(Math.random() * 1000).toString(16).padStart(3, '0');
  };

  const [heapAddresses] = useState({
    user: generateHeapAddress(),
    numbers: generateHeapAddress(),
    deepCopy: generateHeapAddress(),
    app: generateHeapAddress(),
    config: generateHeapAddress(),
    users: generateHeapAddress(),
  });

  const updateVariable = (tab, path, value) => {
    setVariables((prev) => {
      const newVars = { ...prev };
      let current = newVars[tab];
      const parts = path.split('.');
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]].mem = value;
      current[parts[parts.length - 1]].val = value;
      return newVars;
    });
  };

  const renderEditableCode = (tab) => {
    switch (tab) {
      case 'primitive':
        return (
          <div className="space-y-4">
            {Object.entries(variables.primitive).map(([name, {val,editable}]) => (
              <div key={name} className="flex items-center gap-4">
                <code className="w-40"><span className='keyword'>let</span> <span className='variable'>{name}</span> = </code>
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updateVariable('primitive', name, e.target.value)}
                  className="font-mono p-2 border rounded"
                  disabled={!editable}
                />
              </div>
            ))}
          </div>
        );

      case 'reference':
        return (
          <div className="space-y-4">
            <div>
              <div className='flex items-center gap-4'>
                <code className='w-40'><span className='keyword'>let</span> <span className='variable'>user</span> = {'{'}</code>
              </div>
              <div className="ml-4 space-y-2">
                <div className="flex items-center gap-4">
                  <code className="w-20">name: </code>
                  <input
                    type="text"
                    value={variables.reference.user.name.val}
                    onChange={(e) => updateVariable('reference', 'user.name', e.target.value)}
                    className="font-mono p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <code className="w-20">age: </code>
                  <input
                    type="text"
                    value={variables.reference.user.age.val}
                    onChange={(e) => updateVariable('reference', 'user.age', e.target.value)}
                    className="font-mono p-2 border rounded"
                    />
                    <code>{'}'}</code>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <code className="w-40"><span className='keyword'>let</span> <span className='variable'>numbers</span> = </code>
              <input

                type="text"
                value={variables.reference.numbers.val}
                onChange={(e) => updateVariable('reference', 'numbers', e.target.value)}
                className="font-mono p-2 border rounded"
              />
            </div>
            <div className="flex items-center gap-4">
              <code className="w-40"><span className='keyword'>let</span> <span className='variable'>numbersTwo</span> = </code>
              <span onChange={(e) => updateVariable('reference', 'numbersTwo', e.target.value)}
                className="font-mono p-2">
                {variables.reference.numbersTwo.val};
              </span>
            </div>
            <div className="flex items-center gap-4">
              <code className="w-40"><span className='keyword'>let</span> <span className='variable'>deepCopy</span> = </code>
              <span onChange={(e) => updateVariable('reference', 'deepCopy', e.target.value)}
                className="font-mono p-2">
                {variables.reference.deepCopy.val};
              </span>
            </div>
          </div>
        );

      case 'complex':
        return (
        <div className="space-y-4">
          <div className='flex items-center gap-4'>
          <code className='w-40'><span className='keyword'>let</span> <span className='variable'>app</span> = {'{'}</code>
        </div>  
        <div className="ml-4 space-y-2">
          <div className="flex items-center gap-4">
            <code className="w-20">name: </code>
            <input
             type="text" 
              value={variables.complex.app.name}
              onChange={(e) => updateVariable('complex', 'app.name', e.target.value)}
              className="font-mono p-2 border rounded"
            />
          </div>
          <div>
            <code>config: {'{'}</code>
            <div className="ml-4 space-y-2">
              <div className="flex items-center gap-4">
                <code className="w-20">theme: </code>
                <input
                 type="text"
                  value={variables.complex.app.config.theme}
                  onChange={(e) => updateVariable('complex', 'app.config.theme', e.target.value)}
                  className="font-mono p-2 border rounded"
                />
              </div>
              <code>users: [{'{'}</code>
              <div className="ml-4 space-y-2">
                <div className="flex items-center gap-4">
                  <code className="w-20">id: </code>
                  <input
                   type="text"
                    value={variables.complex.app.config.users[0].id}
                    onChange={(e) => updateVariable('complex', 'app.config.users.0.id', e.target.value)}
                    className="font-mono p-2 border rounded"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <code className="w-20">name: </code>
                  <input
                   type="text"
                    value={variables.complex.app.config.users[0].name}
                    onChange={(e) => updateVariable('complex', 'app.config.users.0.name', e.target.value)}
                    className="font-mono p-2 border rounded"
                  />
                  <code>{'}]'}</code>
                  <code>{'}'}</code>
                  <code>{'}'}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        );
      default:
        return null;
    }
  };

const drawBox = (ctx, x, y, width, height, text, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#666';
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#000';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 18;
    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        x + width/2,
        y + height/2 - (lines.length - 1) * lineHeight/2 + i * lineHeight
      );
    });
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const length = 10;
    
    ctx.lineTo(
      toX - length * Math.cos(angle - Math.PI/6),
      toY - length * Math.sin(angle - Math.PI/6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - length * Math.cos(angle + Math.PI/6),
      toY - length * Math.sin(angle + Math.PI/6)
    );
    
    ctx.strokeStyle = '#666';
    ctx.stroke();
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Memory Model', canvas.width / 2, 30);

    if (activeTab === 'primitive') {
      ctx.textAlign = 'left';
      ctx.fillText('Stack Memory', 50, 70);
      
      Object.entries(variables.primitive).forEach(([name, value], i) => {
        const y = 100 + i * 60;
        drawBox(ctx, 50, y, 120, 40, name, '#bfdbfe');
        drawBox(ctx, 180, y, 150, 40, value.mem, '#bbf7d0');
      });
    } else {
      // Draw Stack
      ctx.textAlign = 'left';
      ctx.fillText('Stack', 50, 70);
      ctx.fillText('Heap', 400, 70);
      
      if (activeTab === 'reference') {
        // Draw user reference
        
        
        drawBox(ctx, 50, 100, 100, 40, 'user', '#bfdbfe');
        drawBox(ctx, 160, 100, 120, 40, heapAddresses.user, '#bbf7d0');
        drawArrow(ctx, 290, 120, 400, 120);
        
        // Draw user object in heap
        drawBox(ctx, 400, 100, 100, 40, heapAddresses.user, '#fde68a');
        drawBox(ctx, 400, 145, 350, 40, 
          `{ name: ${variables.reference.user.name.mem}, age: ${variables.reference.user.age.mem} }`,
          '#f5d0fe'
        );
        
        // Draw numbers reference
        drawBox(ctx, 50, 200, 100, 40, 'numbers', '#bfdbfe');
        drawBox(ctx, 160, 200, 120, 40, heapAddresses.numbers, '#bbf7d0');
        drawArrow(ctx, 290, 220, 400, 220);

         // Draw numbersTwo reference
         drawBox(ctx, 50, 300, 100, 40, 'numbersTwo', '#bfdbfe');
         drawBox(ctx, 160, 300, 120, 40, heapAddresses.numbers, '#bbf7d0');
         drawArrow(ctx, 290, 320, 400, 220);

        // Draw numbersDeepcopy reference
        drawBox(ctx, 50, 400, 100, 40, 'deepCopy', '#bfdbfe');
        drawBox(ctx, 160, 400, 120, 40, heapAddresses.deepCopy, '#bbf7d0');
        drawArrow(ctx, 290, 420, 400, 320);
        
        // Draw copied array in heap
        drawBox(ctx, 400, 300, 100, 40, heapAddresses.deepCopy, '#fde68a');
        drawBox(ctx, 400, 345, 350, 40, variables.reference.deepCopy.mem, '#fecaca');


        // Draw array in heap
        drawBox(ctx, 400, 200, 100, 40, heapAddresses.numbers, '#fde68a');
        drawBox(ctx, 400, 245, 350, 40, variables.reference.numbers.mem, '#fecaca');
      } else if (activeTab === 'complex') {
        // Draw app reference
        drawBox(ctx, 50, 100, 100, 40, 'app', '#bfdbfe');
        drawBox(ctx, 160, 100, 120, 40, heapAddresses.app, '#bbf7d0');
        drawArrow(ctx, 290, 120, 400, 120);
        
        // Draw app object in heap
        drawBox(ctx, 400, 100, 100, 40, heapAddresses.app, '#fde68a');
        drawBox(ctx, 400, 145, 350, 40,
          `{ name: ${variables.complex.app.name}, config: ${heapAddresses.config} }`,
          '#f5d0fe'
        );
        
        // Draw config object
        drawBox(ctx, 400, 200, 100, 40, heapAddresses.config, '#fde68a');
        drawBox(ctx, 400, 245, 350, 40,
          `{ theme: ${variables.complex.app.config.theme}, users: ${heapAddresses.users} }`,
          '#f5d0fe'
        );
        drawArrow(ctx, 600, 165, 400, 220);
        
        // Draw users array
        drawBox(ctx, 400, 300, 100, 40, heapAddresses.users, '#fde68a');
        drawBox(ctx, 400, 345, 350, 40,
          `[{ id: ${variables.complex.app.config.users[0].id}, name: ${variables.complex.app.config.users[0].name} }]`,
          '#fecaca'
        );
        drawArrow(ctx, 600, 265, 400, 320);
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      render();
    }
  }, [activeTab, variables]);

  return (
    <div className="w-full max-w-4xl p-6 bg-white border rounded-md shadow">
      <h1>JS Memory Explorer</h1>
      <h2 className='mb-10'>Visualizing Value/Primitive Types vs. Reference Types</h2>
      <div className="flex space-x-4 mb-4">
        <button
          className={`w-1/3 px-4 py-2 rounded ${activeTab === 'primitive' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('primitive')}
        >
          Value/Primitive Types
        </button>
        <button
          className={`w-1/3 px-4 py-2 rounded ${activeTab === 'reference' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('reference')}
        >
          Reference Types
        </button>
        <button
          className={`w-1/3 px-4 py-2 rounded ${activeTab === 'complex' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('complex')}
        >
          Complex Object
        </button>
      </div>

      <div className="bg-slate-50 p-4 rounded-md mb-4">
        <h3 className='mb-10'><strong>Human-readable code in your text editor</strong></h3>
        {renderEditableCode(activeTab)}
      </div>
      <canvas ref={canvasRef} width={800} height={500} className="border border-slate-200 rounded-md w-full" />
    </div>
  );
};

export default MemoryVisualizer;
