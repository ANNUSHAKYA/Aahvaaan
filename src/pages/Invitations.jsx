import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import templates, { collections } from '../data/templates';
import TemplateCard from '../components/TemplateCard';
import SectionHeading from '../components/SectionHeading';

export default function Invitations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCollection = searchParams.get('collection') || 'All Collections';

  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.collection.toLowerCase().includes(search.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(search.toLowerCase());
      const matchesCollection =
        selectedCollection === 'All Collections' || t.collection === selectedCollection;
      return matchesSearch && matchesCollection;
    });
  }, [search, selectedCollection]);

  const handleCollectionChange = (col) => {
    setSelectedCollection(col);
    if (col === 'All Collections') {
      searchParams.delete('collection');
    } else {
      searchParams.set('collection', col);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-padding bg-champagne/30 pb-10">
        <div className="container-custom mx-auto">
          <SectionHeading
            subtitle="Signature Collections"
            title="Explore 4 Signature Wedding Invitations"
            description="Every celebration deserves a beautiful beginning. Discover our four distinct, meticulously crafted digital wedding invitation collections — each with its own signature colour palette, bespoke typography, and interactive aesthetic."
          />

          {/* Search & Collection Filter Bar */}
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
              <input
                type="text"
                placeholder="Search signature designs or collections..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-champagne rounded-lg font-body text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-xs"
                aria-label="Search invitation designs"
              />
            </div>

            {/* Collection Filter Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {collections.map((col) => (
                <button
                  key={col}
                  onClick={() => handleCollectionChange(col)}
                  className={`font-body text-xs px-4 py-2 rounded-full transition-all duration-200 border ${
                    selectedCollection === col
                      ? 'bg-wine text-white border-wine shadow-xs font-semibold'
                      : 'bg-white text-charcoal border-champagne hover:border-wine hover:text-wine'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding pt-10">
        <div className="container-custom mx-auto">
          {/* Results count & Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-champagne/50">
            <p className="font-body text-sm text-charcoal/70">
              Showing <strong>{filteredTemplates.length}</strong> signature invitation {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </p>
            <span className="font-body text-xs text-gold flex items-center gap-1.5">
              <Sparkles size={14} /> Each design features a bespoke colour palette & full interactive preview
            </span>
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
              <AnimatePresence>
                {filteredTemplates.map((template, index) => (
                  <TemplateCard key={template.id} template={template} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl card-shadow border border-champagne/40 max-w-md mx-auto">
              <p className="font-heading text-2xl text-wine mb-2">No designs match your search</p>
              <p className="font-body text-sm text-charcoal/60 mb-6">
                Try searching for "Romance", "Botanical", "Maharaja", or "Dream".
              </p>
              <button
                onClick={() => { setSearch(''); setSelectedCollection('All Collections'); }}
                className="btn-secondary text-xs py-2 px-5"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
