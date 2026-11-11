import React, { useState } from 'react';
import { FoodCategory, FoodItem } from '../types/game';
import { FOOD_DATABASE, CATEGORY_DEFINITIONS } from '../data/foodItems';
import { sounds } from '../utils/soundEffects';
import { Plus, Check, AlertCircle } from 'lucide-react';

interface FoodShelfProps {
  onAddFood: (item: FoodItem) => void;
  maxReached: boolean;
  plateItemIds?: string[];
}

export const FoodShelf: React.FC<FoodShelfProps> = ({
  onAddFood,
  maxReached,
  plateItemIds = [],
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');

  const filteredFoods =
    selectedCategory === 'all'
      ? FOOD_DATABASE
      : FOOD_DATABASE.filter((item) => item.category === selectedCategory);

  const handleDragStart = (e: React.DragEvent, item: FoodItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleItemClick = (e: React.MouseEvent | React.TouchEvent, item: FoodItem) => {
    e.preventDefault();
    if (!maxReached) {
      sounds.playDrop();
      onAddFood(item);
    } else {
      sounds.playBuzz();
    }
  };

  const categories: Array<{ id: FoodCategory | 'all'; label: string; icon: string }> = [
    { id: 'all', label: 'الكل', icon: '🍽️' },
    { id: 'vegetables', label: 'خضروات', icon: '🥦' },
    { id: 'fruits', label: 'فواكه', icon: '🍎' },
    { id: 'grains', label: 'نشويات', icon: '🌾' },
    { id: 'proteins', label: 'بروتينات', icon: '🍗' },
    { id: 'dairy', label: 'ألبان', icon: '🥛' },
    { id: 'junk', label: 'غير صحي', icon: '⚠️' },
  ];

  return (
    <section className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 mt-4">
      {/* Header and Category Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <span>سلة الأطعمة المتاحة</span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              اضغط على أي صنف لإضافته فوراً
            </span>
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            اختر 5 أطعمة لتغطية المجموعات الغذائية المتوازنة وتجنب الأطعمة غير الصحية
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setSelectedCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Food Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 max-h-[320px] overflow-y-auto pr-1">
        {filteredFoods.map((item) => {
          const isJunk = item.category === 'junk';
          const def = CATEGORY_DEFINITIONS[item.category];
          const isAlreadyInPlate = plateItemIds.includes(item.id);

          return (
            <button
              key={item.id}
              type="button"
              draggable={!maxReached}
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={(e) => handleItemClick(e, item)}
              disabled={maxReached}
              aria-label={`إضافة ${item.name}`}
              className={`relative flex flex-col justify-between p-3 rounded-2xl border text-right transition-all transform active:scale-95 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                maxReached
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
                  : isJunk
                  ? 'bg-rose-50/70 hover:bg-rose-100/80 border-rose-200 hover:border-rose-300 shadow-sm'
                  : 'bg-slate-50/80 hover:bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              {/* Badge & Emoji */}
              <div className="flex items-start justify-between w-full">
                <span className="text-3xl sm:text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${def.badgeBg}`}
                >
                  {def.label}
                </span>
              </div>

              {/* Title & Benefit */}
              <div className="mt-2.5 w-full">
                <div className="text-sm font-black text-slate-900 leading-snug group-hover:text-emerald-700">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-700 line-clamp-1 mt-0.5">
                  {item.benefit}
                </div>
              </div>

              {/* Footer action */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between w-full text-xs font-black">
                <span className={isJunk ? 'text-rose-800' : 'text-emerald-800'}>
                  {isJunk ? '-20 نقطة' : `+${item.basePoints}`}
                </span>

                <span className="inline-flex items-center gap-1 text-slate-700 group-hover:text-emerald-800 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 group-hover:border-emerald-300">
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
