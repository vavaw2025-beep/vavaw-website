'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/lib/data';

interface NewsCarouselProps {
  items: NewsItem[];
}

export function NewsCarousel({ items }: NewsCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  };

  const getVisibleItems = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(items[(current + i) % items.length]);
    }
    return visible;
  };

  return (
    <section id="news" className="py-24 md:py-32 bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Latest News
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              News & Campaigns
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={prev}
              className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Previous news"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={next}
              className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Next news"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="grid md:grid-cols-3 gap-6">
          {getVisibleItems().map((item, idx) => (
            <motion.div
              key={`${item.id}-${current}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-lg bg-background border border-border/50 hover:border-primary/50 transition-all"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs text-foreground/60 font-medium">{item.date}</p>

                <h3 className="mt-3 text-xl font-bold text-foreground line-clamp-2">
                  {item.title}
                </h3>

                <p className="mt-3 text-foreground/70 text-sm leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>

                {/* Link */}
                <Link
                  href={item.link}
                  className="mt-4 inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center gap-2"
        >
          {items.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current
                  ? 'bg-primary w-8'
                  : 'bg-foreground/20 w-2 hover:bg-foreground/40'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
