import React, { useState } from 'react';
import type { NoteItem } from '../../types';
import { Pin, Edit3, Trash2, Copy, Check, Clock } from 'lucide-react';

interface NoteCardProps {
  note: NoteItem;
  onEdit: (note: NoteItem) => void;
  onDelete: (note: NoteItem) => void;
  onTogglePin: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onTogglePin,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(note.updatedAt || note.createdAt));

  const noteBg = note.color || '#FEF08A';

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 p-5 flex flex-col justify-between group/note relative hover:shadow-md ${
        note.isPinned
          ? 'ring-2 ring-neutral-900/10 shadow-xs'
          : 'shadow-2xs'
      }`}
      style={{
        backgroundColor: `${noteBg}20`,
        borderColor: `${noteBg}90`,
      }}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          {/* Category Badge & Color Indicator */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: noteBg }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-neutral-200/60 text-neutral-700">
              {note.category || 'General'}
            </span>
          </div>

          {/* Pin Button */}
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              note.isPinned
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-800 hover:bg-white/80'
            }`}
            title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
          >
            <Pin size={13} className={note.isPinned ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Note Title */}
        <h3 className="font-display font-bold text-base text-neutral-900 tracking-tight leading-snug mb-2 group-hover/note:text-[#DF886F] transition-colors">
          {note.title}
        </h3>

        {/* Note Content */}
        <div className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap line-clamp-6 font-sans mb-3 select-text">
          {note.content}
        </div>

        {/* Tag Chips */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold text-neutral-600 bg-white/70 px-2 py-0.5 rounded-md border border-neutral-200/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-black/5 flex items-center justify-between text-neutral-400 mt-2">
        <span className="text-[10px] flex items-center gap-1 font-medium text-neutral-500">
          <Clock size={11} />
          <span>{formattedDate}</span>
        </span>

        <div className="flex items-center gap-1">
          {/* Quick Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-7 h-7 rounded-lg hover:bg-white/80 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Copy note content"
          >
            {copied ? (
              <Check size={13} className="text-emerald-600" />
            ) : (
              <Copy size={13} />
            )}
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(note)}
            className="w-7 h-7 rounded-lg hover:bg-white/80 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Edit note"
          >
            <Edit3 size={13} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(note)}
            className="w-7 h-7 rounded-lg hover:bg-rose-50 text-neutral-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Delete note"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
