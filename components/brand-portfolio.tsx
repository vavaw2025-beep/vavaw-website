'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Brand } from '@/lib/data';

interface BrandPortfolioProps {
  brands: Brand[];
}

export function BrandPortfolio({ brands }: BrandPortfolioProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="brands" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-wider">
            Our Portfolio
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Iconic Brands
          </h2>
          <p className="mt-6 text-lg text-foreground/70 max-w-2xl">
            Each brand in our portfolio represents the pinnacle of excellence in its
            category, combining heritage with innovation.
          </p>
        </motion.div>

        {/* Brand Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-all"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {brand.category}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-foreground">
                  {brand.name}
                </h3>
                <p className="mt-3 text-foreground/70 text-sm leading-relaxed">
                  {brand.description}
                </p>

                {/* Link */}
                <Link
                  href={brand.link}
                  className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
                >
                  Explore
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
