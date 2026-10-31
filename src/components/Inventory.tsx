import React, { useState } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  supplier: string;
  purchaseDate: string;
  expiryDate: string;
  notes: string;
}

const categories = [
  'مواد مصرفی',
  'کیت آزمایشی',
  'معرف شیمروای',
  'دستگاه ؈ تجهروات',
  'نمونه و سرم',
  'سایر',
];

export const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState({
    name: '',
    category: 'مواد مصرفی',
    quantity: '',
    unit: '',
    supplier: '',
    purchaseDate: '',
    expiryDate: '',
    notes: '',
  });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const newItem: InventoryItem = {
      id: crypto.randomUUID(),
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      supplier: form.supplier,
      purchaseDate: form.purchaseDate,
      expiryDate: form.expiryDate,
      notes: form.notes,
    };
    setItems([newItem, ...items]);
    setForm({
      name: '',
      category: 'مواد مصرفی',
      quantity: '',
      unit: '',
      supplier: '',
      purchaseDate: '',
      expiryDate: '',
      notes: '',
    });
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8" style={{ direction: 'rtl' }}>
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">موجودی انبار</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">نام محصول</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="مثلاً کیت CBC"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">ؿسته‌بندی</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">تعداد</label>
            <input
              type="number"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">واحد</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="مثلاً بسته،لت؉"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">تامرنین‌کننده</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="نام شرکت"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">تارٌخ خرٌد</label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">تاریخ انقضا</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">توضیحات</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="یادداشت اختیاری"
            />
          </div>
        </div>
        <div className="mt-4 text-left">
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            افذودن به انبار
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-sm">هنوز هیچ محصولی ثبت نشده است.</p>
          <p className="text-xs mt-1">فرم بالا را پر کنید و اولین م؈رد را اضافه کنید.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">نام محصول</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">دسته</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">موجودی</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">تامین‌کننده</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">خرید</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">انقضا</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-600">حذف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="inline-flex px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.supplier || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.purchaseDate || '-'}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{item.expiryDate || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
            تعداد کل اقلام: {items.length}
          </div>
        </div>
      )}
    </div>
  );
};
