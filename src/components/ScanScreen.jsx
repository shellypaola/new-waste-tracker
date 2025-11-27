// ScanScreen.jsx
// Complete scanning interface with camera, product lookup, and manual fallback

import React, { useState } from 'react';
import { Camera, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import ProductLookupService, { getDefaultExpiryDays } from './ProductLookupService';

const ScanScreen = ({ 
  onAddItem, 
  onClose, 
  colors,
  dailyScans,
  onScanComplete,
  getDefaultExpiryDate,
  getDaysUntilExpiry,
  getEmojiForItem,
  currentInventory // Add this to check for duplicates
}) => {
  const [scanningState, setScanningState] = useState('ready'); // ready, scanning, loading, success, error, not_found
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  
  // Form state for manual entry or editing scanned data
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'fridge',
    cost: '',
    expiryDate: getDefaultExpiryDate(7),
    quantity: 1,
    barcode: ''
  });

  const handleStartScanning = () => {
    setScanningState('scanning');
  };

  const handleBarcodeDetected = async (barcode) => {
    console.log('Barcode detected:', barcode);
    setScannedBarcode(barcode);
    setScanningState('loading');
    
    // Increment scan counter
    if (onScanComplete) {
      onScanComplete();
    }

    try {
      // Set 5 second timeout for product lookup
      const lookupPromise = ProductLookupService.searchByBarcode(barcode);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 5000)
      );
      
      // Race between lookup and timeout
      const product = await Promise.race([lookupPromise, timeoutPromise]);
      
      if (product && product.found) {
        // Product found!
        setProductData(product);
        
        // Pre-fill form with product data
        const expiryDays = getDefaultExpiryDays(product.category);
        setItemForm({
          name: product.name,
          category: product.category,
          cost: '', // User needs to enter price
          expiryDate: getDefaultExpiryDate(expiryDays),
          quantity: 1,
          barcode: barcode
        });
        
        setScanningState('success');
      } else {
        // Product not found
        setScanningState('not_found');
        setItemForm({
          ...itemForm,
          barcode: barcode
        });
      }
    } catch (err) {
      console.error('Product lookup error:', err);
      
      // Check if it's a timeout
      if (err.message === 'TIMEOUT') {
        setScanningState('not_found');
        setItemForm({
          ...itemForm,
          barcode: barcode
        });
      } else {
        setError('Unable to look up product. Please enter details manually.');
        setScanningState('error');
      }
    }
  };

  const handleScannerClose = (reason) => {
    if (reason === 'manual') {
      setScanningState('not_found');
    } else {
      setScanningState('ready');
    }
  };

  const handleAddToInventory = () => {
    if (!itemForm.name || !itemForm.cost) {
      alert('Please fill in all required fields');
      return;
    }

    const daysUntilExpiry = getDaysUntilExpiry(itemForm.expiryDate);
    const autoEmoji = getEmojiForItem(itemForm.name, itemForm.category);
    
    // Check if this barcode already exists in inventory
    const existingItem = itemForm.barcode 
      ? currentInventory.find(item => item.barcode === itemForm.barcode)
      : null;
    
    if (existingItem) {
      // Update existing item - increase quantity and add cost
      const updatedItem = {
        ...existingItem,
        quantity: (existingItem.quantity || 1) + parseInt(itemForm.quantity || 1),
        cost: existingItem.cost + parseFloat(itemForm.cost || 0),
        // Keep the barcode
        barcode: itemForm.barcode
      };
      
      onAddItem(updatedItem, 'update');
      onClose();
    } else {
      // Create new item
      const newItem = {
        id: Date.now(),
        name: itemForm.name,
        emoji: autoEmoji,
        category: itemForm.category,
        cost: parseFloat(itemForm.cost) || 0,
        daysUntilExpiry: daysUntilExpiry,
        status: 'sealed',
        quantity: parseInt(itemForm.quantity) || 1,
        barcode: itemForm.barcode || null
      };

      onAddItem(newItem, 'new');
      onClose();
    }
  };

  // Show barcode scanner
  if (scanningState === 'scanning') {
    return (
      <BarcodeScanner
        onScanSuccess={handleBarcodeDetected}
        onClose={handleScannerClose}
        colors={colors}
      />
    );
  }

  // Loading state
  if (scanningState === 'loading') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>Looking up product...</h2>
          <p className="text-sm" style={{ color: colors.textSecondary }}>Barcode: {scannedBarcode}</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader size={48} className="animate-spin mx-auto mb-4" style={{ color: colors.primary }} />
            <p className="text-base font-medium" style={{ color: colors.text }}>Searching product database...</p>
          </div>
        </div>
      </div>
    );
  }

  // Product found - show form with pre-filled data
  if (scanningState === 'success' && productData) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onClose} className="p-2 -ml-2">
              <span className="text-2xl">←</span>
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Product Found!</h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Verify and add to inventory</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.freshBg }}>
              <CheckCircle size={24} style={{ color: colors.fresh }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-5 max-w-md mx-auto">
            
            {/* Product Image (if available) */}
            {productData.image && (
              <div className="text-center">
                <img 
                  src={productData.image} 
                  alt={productData.name}
                  className="w-32 h-32 object-contain mx-auto rounded-lg"
                  style={{ border: `2px solid ${colors.border}` }}
                />
              </div>
            )}

            {/* Product Info */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: colors.primaryLight }}>
              <div className="text-sm font-semibold mb-1" style={{ color: colors.primary }}>
                Scanned Product
              </div>
              <div className="font-bold text-lg" style={{ color: colors.text }}>
                {productData.name}
              </div>
              {productData.brand && (
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {productData.brand}
                </div>
              )}
              <div className="text-xs mt-2" style={{ color: colors.textLight }}>
                Barcode: {scannedBarcode}
              </div>
            </div>

            {/* Editable Form Fields */}
            <div>
              <label className="block text-base font-semibold mb-2" style={{ color: colors.text }}>
                Item Name
              </label>
              <input
                type="text"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                className="w-full px-4 py-4 rounded-xl border-2 text-base"
                style={{ borderColor: colors.border, minHeight: '56px' }}
              />
            </div>

            <div>
              <label className="block text-base font-semibold mb-2" style={{ color: colors.text }}>
                Cost *
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={itemForm.cost}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  setItemForm({ ...itemForm, cost: value });
                }}
                placeholder="$0.00"
                className="w-full px-4 py-4 rounded-xl border-2 text-base"
                style={{ borderColor: colors.border, minHeight: '56px' }}
              />
              <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                * Price not available in database - please enter
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setItemForm({ ...itemForm, quantity: Math.max(1, itemForm.quantity - 1) })}
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  −
                </button>
                <div
                  className="flex-1 px-4 py-3 rounded-xl text-lg text-center font-semibold"
                  style={{ 
                    backgroundColor: colors.bgGray, 
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    minHeight: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {itemForm.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setItemForm({ ...itemForm, quantity: itemForm.quantity + 1 })}
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Storage Location
              </label>
              <select
                value={itemForm.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const defaultDays = getDefaultExpiryDays(cat);
                  setItemForm({ 
                    ...itemForm, 
                    category: cat,
                    expiryDate: getDefaultExpiryDate(defaultDays)
                  });
                }}
                className="w-full px-4 py-3 rounded-xl text-base"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bgGray,
                  border: `1px solid ${colors.border}`,
                  minHeight: '56px',
                  appearance: 'none',
                  paddingRight: '48px'
                }}
              >
                <option value="fridge">🧊 Fridge ({getDefaultExpiryDays('fridge')} days)</option>
                <option value="freezer">❄️ Freezer ({getDefaultExpiryDays('freezer')} days)</option>
                <option value="pantry">📦 Pantry ({getDefaultExpiryDays('pantry')} days)</option>
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Expiry Date
              </label>
              <input
                type="date"
                value={itemForm.expiryDate}
                onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-base"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bgGray,
                  border: `1px solid ${colors.border}`,
                  minHeight: '56px'
                }}
              />
            </div>

          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={handleAddToInventory}
            disabled={!itemForm.name || !itemForm.cost}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base"
            style={{
              backgroundColor: (!itemForm.name || !itemForm.cost) ? colors.textLight : colors.fresh,
              opacity: (!itemForm.name || !itemForm.cost) ? 0.5 : 1
            }}
          >
            Add to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Product not found or error - manual entry
  if (scanningState === 'not_found' || scanningState === 'error') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-3 mb-2">
            <button onClick={onClose} className="p-2 -ml-2">
              <span className="text-2xl">←</span>
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>Product Not Found</h2>
              <p className="text-sm" style={{ color: colors.textSecondary }}>Please enter details manually</p>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.warningBg }}>
              <AlertCircle size={24} style={{ color: colors.warning }} />
            </div>
          </div>
        </div>

        {scannedBarcode && (
          <div className="px-4 py-3" style={{ backgroundColor: colors.bgGray }}>
            <div className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
              Scanned Barcode
            </div>
            <div className="text-sm font-mono" style={{ color: colors.text }}>
              {scannedBarcode}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-5 max-w-md mx-auto">
            
            {/* Manual Entry Form - Same as your existing manual entry */}
            <div>
              <label className="block text-base font-semibold mb-2" style={{ color: colors.text }}>
                Item Details
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="Item name"
                  className="flex-1 px-4 py-4 rounded-xl border-2 text-base"
                  style={{ borderColor: colors.border, minHeight: '56px' }}
                />
                <input
                  type="text"
                  inputMode="decimal"
                  value={itemForm.cost}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setItemForm({ ...itemForm, cost: value });
                  }}
                  placeholder="$0.00"
                  className="px-4 py-4 rounded-xl border-2 text-base text-center"
                  style={{ borderColor: colors.border, minHeight: '56px', width: '120px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setItemForm({ ...itemForm, quantity: Math.max(1, itemForm.quantity - 1) })}
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  −
                </button>
                <div
                  className="flex-1 px-4 py-3 rounded-xl text-lg text-center font-semibold"
                  style={{ 
                    backgroundColor: colors.bgGray, 
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    minHeight: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {itemForm.quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setItemForm({ ...itemForm, quantity: itemForm.quantity + 1 })}
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: colors.bgGray, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Category
              </label>
              <select
                value={itemForm.category}
                onChange={(e) => {
                  const cat = e.target.value;
                  const defaultDays = getDefaultExpiryDays(cat);
                  setItemForm({ 
                    ...itemForm, 
                    category: cat,
                    expiryDate: getDefaultExpiryDate(defaultDays)
                  });
                }}
                className="w-full px-4 py-3 rounded-xl text-base"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bgGray,
                  border: `1px solid ${colors.border}`,
                  minHeight: '56px',
                  appearance: 'none'
                }}
              >
                <option value="fridge">🧊 Fridge (7 days)</option>
                <option value="freezer">❄️ Freezer (90 days)</option>
                <option value="pantry">📦 Pantry (1 year)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                Expiry Date
              </label>
              <input
                type="date"
                value={itemForm.expiryDate}
                onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-base"
                style={{
                  borderColor: colors.border,
                  backgroundColor: colors.bgGray,
                  border: `1px solid ${colors.border}`,
                  minHeight: '56px'
                }}
              />
            </div>

          </div>
        </div>

        <div className="p-4 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={handleAddToInventory}
            disabled={!itemForm.name || !itemForm.cost}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base"
            style={{
              backgroundColor: (!itemForm.name || !itemForm.cost) ? colors.textLight : colors.fresh,
              opacity: (!itemForm.name || !itemForm.cost) ? 0.5 : 1
            }}
          >
            Add to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Initial state - ready to scan
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="px-4 pt-6 pb-4 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onClose} className="p-2 -ml-2">
            <span className="text-2xl">←</span>
          </button>
          <h2 className="text-xl font-bold" style={{ color: colors.text }}>Scan Barcode</h2>
        </div>
        <div className="text-sm" style={{ color: colors.textSecondary }}>
          Scans today: {dailyScans}/50
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primaryLight }}>
            <Camera size={48} style={{ color: colors.primary }} />
          </div>
          <h3 className="text-xl font-bold mb-3" style={{ color: colors.text }}>
            Ready to Scan
          </h3>
          <p className="text-base mb-8" style={{ color: colors.textSecondary }}>
            Open the camera to scan product barcodes and auto-fill item details
          </p>
          <button
            onClick={handleStartScanning}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-base mb-3"
            style={{ backgroundColor: colors.primary }}
          >
            Start Scanning
          </button>
          <button
            onClick={() => setScanningState('not_found')}
            className="w-full py-3.5 rounded-xl font-semibold text-base"
            style={{ backgroundColor: colors.bgGray, color: colors.text }}
          >
            Enter Manually Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanScreen;
