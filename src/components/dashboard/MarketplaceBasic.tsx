"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, DollarSign, Package, Filter } from "lucide-react";

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

export default function MarketplaceBasic() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    fetchItems();
  }, [filterCategory]);

  async function fetchItems() {
    try {
      let query = supabase
        .from("marketplace_items")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (filterCategory !== "all") {
        query = query.eq("category", filterCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Marketplace</h2>
          <p className="text-sm text-[#a0a0b4]">Browse parts, gear, and accessories</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#a0a0b4]" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-[#0d0d0d] border border-[#D9BA84]/20 rounded-lg text-sm focus:outline-none focus:border-[#D9BA84]/40"
          >
            <option value="all">All Categories</option>
            <option value="parts">Parts</option>
            <option value="accessories">Accessories</option>
            <option value="gear">Gear</option>
            <option value="bikes">Bikes</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#a0a0b4]">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl p-12 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-[#a0a0b4]" />
          <h3 className="text-xl font-bold mb-2">No Items Available</h3>
          <p className="text-[#a0a0b4]">Check back soon for new items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#0d0d0d] border border-[#D9BA84]/13 rounded-2xl overflow-hidden hover:border-[#D9BA84]/25 transition group cursor-pointer"
            >
              {item.image_url ? (
                <div className="aspect-video bg-[#000000] border-b border-[#D9BA84]/10 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-[#000000] border-b border-[#D9BA84]/10 flex items-center justify-center">
                  <Package size={48} className="text-[#a0a0b4]" />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg line-clamp-1 flex-1">{item.title}</h3>
                  <span className="px-2 py-1 bg-[#D9BA84]/10 border border-[#D9BA84]/20 rounded-full text-xs font-semibold text-[#D9BA84] capitalize ml-2">
                    {item.category}
                  </span>
                </div>

                <p className="text-sm text-[#a0a0b4] mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[#D9BA84]/10">
                  <div className="flex items-center gap-1 text-[#D9BA84]">
                    <DollarSign size={20} />
                    <span className="text-2xl font-bold">{item.price.toFixed(2)}</span>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-br from-[#D9BA84] to-[#c8b450] text-black text-sm font-semibold rounded-lg hover:opacity-90 transition">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-xs text-[#a0a0b4]">
        Showing {items.length} {filterCategory === "all" ? "items" : `${filterCategory} items`}
      </div>
    </div>
  );
}
