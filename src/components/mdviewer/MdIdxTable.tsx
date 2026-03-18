import React from 'react';
import { TocItem } from './utils/parser';

interface MdIdxTableProps {
  toc: TocItem[];
}

const MdIdxTable: React.FC<MdIdxTableProps> = ({ toc }) => {
  return (
    <nav className="sticky top-12 p-5 border border-slate-200 rounded-xl bg-slate-50/50">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
        Table of Contents
      </h3>
      <div className="text-sm space-y-2">
        {toc.length > 0 ? (
          toc.map((item, idx) => {
            const isSubItem = item.level > 1;

            return (
              <a
                key={`${item.anchorId}-${idx}`}
                href={`#${item.anchorId}`}
                className={`block transition-colors hover:text-sky-600 ${
                  isSubItem 
                    ? 'pl-4 text-xs text-slate-400' 
                    : 'font-medium text-slate-500'
                }`}
              >
                {item.text}
              </a>
            );
          })
        ) : (
          <p className="text-xs text-slate-400">목차가 없습니다.</p>
        )}
      </div>
    </nav>
  );
};

export default MdIdxTable;