// DuplicateConfirmModal.jsx
// Beautiful confirmation modal for duplicate items

import React from 'react';
import { Package, Plus, Layers } from 'lucide-react';

const DuplicateConfirmModal = ({ 
  existingItem, 
  newItem, 
  onCombine, 
  onAddSeparate, 
  onCancel,
  colors 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{existingItem.emoji}</div>
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
            Item Already Exists
          </h3>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            You already have <strong>{existingItem.name}</strong> in your {existingItem.category}
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="space-y-3 mb-6">
          {/* Current Item */}
          <div 
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: colors.bgGray,
              border: `1px solid ${colors.border}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                CURRENT
              </div>
              <Package size={16} style={{ color: colors.textLight }} />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {existingItem.quantity}x
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                ${existingItem.cost.toFixed(2)} total
              </div>
            </div>
            <div className="text-xs mt-1" style={{ color: colors.textLight }}>
              ${(existingItem.cost / existingItem.quantity).toFixed(2)} per unit
            </div>
          </div>

          {/* New Item */}
          <div 
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: colors.primaryLight,
              border: `1px solid ${colors.primary}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold" style={{ color: colors.primary }}>
                ADDING
              </div>
              <Plus size={16} style={{ color: colors.primary }} />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {newItem.quantity}x
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                ${parseFloat(newItem.cost).toFixed(2)} total
              </div>
            </div>
            <div className="text-xs mt-1" style={{ color: colors.textLight }}>
              ${(parseFloat(newItem.cost) / newItem.quantity).toFixed(2)} per unit
            </div>
          </div>

          {/* Combined Preview */}
          <div 
            className="p-4 rounded-xl"
            style={{ 
              backgroundColor: colors.freshBg,
              border: `1px solid ${colors.fresh}`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold" style={{ color: colors.fresh }}>
                IF COMBINED
              </div>
              <Layers size={16} style={{ color: colors.fresh }} />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold" style={{ color: colors.text }}>
                {existingItem.quantity + newItem.quantity}x
              </div>
              <div className="text-sm" style={{ color: colors.textSecondary }}>
                ${(existingItem.cost + parseFloat(newItem.cost)).toFixed(2)} total
              </div>
            </div>
            <div className="text-xs mt-1" style={{ color: colors.textLight }}>
              ${((existingItem.cost + parseFloat(newItem.cost)) / (existingItem.quantity + newItem.quantity)).toFixed(2)} per unit
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onCombine}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2"
            style={{ backgroundColor: colors.fresh }}
          >
            <Layers size={20} />
            Combine Quantities
          </button>
          
          <button
            onClick={onAddSeparate}
            className="w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: colors.bgGray, 
              color: colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            <Plus size={20} />
            Add as Separate Item
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2.5 rounded-xl font-medium text-sm"
            style={{ 
              backgroundColor: 'transparent',
              color: colors.textLight
            }}
          >
            Cancel
          </button>
        </div>

        {/* Info Box */}
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: colors.primaryLight }}
        >
          <p className="text-xs" style={{ color: colors.primary }}>
            💡 <strong>Tip:</strong> Combining is recommended for the same product purchased at different times. Use "Add Separate" for different brands or varieties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuplicateConfirmModal;
