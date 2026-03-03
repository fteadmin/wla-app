"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ShoppingBag, DollarSign, Package, X } from "lucide-react";

interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  created_by: string;
  created_at: string;
  status: string;
}

export default function MarketplaceAdmin() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "parts",
    image_url: "",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("marketplace_items").insert({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url || null,
        created_by: auth.user.id,
        status: "active",
      });

      if (error) throw error;

      setFormData({ title: "", description: "", price: "", category: "parts", image_url: "" });
      setShowCreateModal(false);
      await fetchItems();
    } catch (error) {
      console.error("Error creating marketplace item:", error);
      alert("Failed to create item");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-1">Marketplace Management</h2>
          <p className="text-sm text-[#a0a0b4]">Post and manage items for sale</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
        >
          <Plus size={16} />
          Post Item
        </button>
      </div>

      {/* Items Grid */}
      {loading && items.length === 0 ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Items Listed</h3>
          <p className="text-[#a0a0b4] mb-6">Post your first item to start selling!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition"
          >
            Post Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl overflow-hidden hover:border-[#D9BA84]/25 transition"
            >
              {item.image_url && (
                <div className="aspect-video bg-[#000000] border-b border-[#D9BA84]/10">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                  <span className="px-2 py-1 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-full text-xs font-semibold text-[#D9BA84] capitalize">
                    {item.category}
                  </span>
                </div>

                <p className="text-sm text-[#a0a0b4] mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[#D9BA84]/10">
                  <div className="flex items-center gap-1 text-[#D9BA84]">
                    <DollarSign size={18} />
                    <span className="text-xl font-bold">{item.price.toFixed(2)}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-[#a0a0b4]/20 text-[#a0a0b4]"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Post New Item</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#a0a0b4] hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={createItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="e.g., Custom Chrome Handlebars"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="Describe the item, condition, specifications..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  >
                    <option value="parts">Parts</option>
                    <option value="accessories">Accessories</option>
                    <option value="gear">Gear</option>
                    <option value="bikes">Bikes</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 bg-[#000000] border border-[#D9BA84]/20 rounded-lg focus:outline-none focus:border-[#D9BA84]/40"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-[#a0a0b4]/10 border border-[#a0a0b4]/20 rounded-lg hover:bg-[#a0a0b4]/20 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
