import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link, Image as ImageIcon, Table, Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = 'Write your trading notes here...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Execute formatting command
  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Convert to base64 and insert
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      insertImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Insert image into editor
  const insertImage = (src: string) => {
    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.borderRadius = '12px';
    img.style.margin = '16px 0';
    img.style.display = 'block';
    
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(img);
      
      // Move cursor after image
      range.setStartAfter(img);
      range.setEndAfter(img);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editorRef.current?.appendChild(img);
    }
    
    handleInput();
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Insert table
  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 16px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="border: 1px solid #404040; padding: 8px; min-width: 50px;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      
      execCommand('insertHTML', tableHTML);
    }
  };

  // Toolbar button component
  const ToolbarButton = ({ 
    icon, 
    command, 
    value, 
    title,
    onClick 
  }: { 
    icon: React.ReactNode; 
    command?: string; 
    value?: string;
    title: string;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      onClick={() => onClick ? onClick() : execCommand(command!, value)}
      disabled={disabled}
      title={title}
      className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      {!disabled && (
        <div className="flex items-center gap-1 mb-4 p-1.5 bg-neutral-900/50 rounded-xl border border-neutral-800 sticky top-0 backdrop-blur-md z-10">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 px-2 border-r border-neutral-800 mr-2">
            <ToolbarButton 
              icon={<Bold size={16} />} 
              command="bold" 
              title="Bold (Ctrl+B)"
            />
            <ToolbarButton 
              icon={<Italic size={16} />} 
              command="italic" 
              title="Italic (Ctrl+I)"
            />
            <ToolbarButton 
              icon={<Underline size={16} />} 
              command="underline" 
              title="Underline (Ctrl+U)"
            />
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1 px-2 border-r border-neutral-800 mr-2">
            <ToolbarButton 
              icon={<AlignLeft size={16} />} 
              command="justifyLeft" 
              title="Align Left"
            />
            <ToolbarButton 
              icon={<AlignCenter size={16} />} 
              command="justifyCenter" 
              title="Align Center"
            />
            <ToolbarButton 
              icon={<AlignRight size={16} />} 
              command="justifyRight" 
              title="Align Right"
            />
          </div>

          {/* Lists & Insert */}
          <div className="flex items-center gap-1">
            <ToolbarButton 
              icon={<List size={16} />} 
              command="insertUnorderedList" 
              title="Bullet List"
            />
            <ToolbarButton 
              icon={<ListOrdered size={16} />} 
              command="insertOrderedList" 
              title="Numbered List"
            />
            <ToolbarButton 
              icon={<Link size={16} />} 
              onClick={insertLink}
              title="Insert Link"
            />
            <ToolbarButton 
              icon={<ImageIcon size={16} />} 
              onClick={() => fileInputRef.current?.click()}
              title="Insert Image"
            />
            <ToolbarButton 
              icon={<Table size={16} />} 
              onClick={insertTable}
              title="Insert Table"
            />
            <ToolbarButton 
              icon={<Code size={16} />} 
              command="formatBlock"
              value="pre"
              title="Code Block"
            />
          </div>
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          min-h-[400px] 
          w-full 
          outline-none 
          text-lg 
          leading-relaxed 
          prose 
          prose-invert 
          max-w-none
          ${disabled ? 'text-neutral-400 cursor-not-allowed' : 'text-neutral-300'}
          ${isFocused ? 'ring-1 ring-red-600/20 rounded-lg' : ''}
        `}
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #525252;
          pointer-events: none;
          position: absolute;
        }
        
        [contenteditable] {
          padding: 12px;
        }

        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 16px 0;
          display: block;
        }

        [contenteditable] table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }

        [contenteditable] table td {
          border: 1px solid #404040;
          padding: 8px;
          min-width: 50px;
        }

        [contenteditable] pre {
          background: #1a1a1a;
          border: 1px solid #404040;
          border-radius: 8px;
          padding: 12px;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }

        [contenteditable] a {
          color: #ef4444;
          text-decoration: underline;
        }

        [contenteditable] ul, [contenteditable] ol {
          padding-left: 24px;
          margin: 12px 0;
        }

        [contenteditable] li {
          margin: 4px 0;
        }

        [contenteditable] strong {
          font-weight: bold;
        }

        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
