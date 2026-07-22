'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function FeaturedBrand() {
  return (
    <section className="py-24 md:py-32 bg-card border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-primary text-sm font-semibold uppercase tracking-wider">
              Featured Collection
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Essence Premium
            </h2>

            <p className="mt-6 text-lg text-foreground/70 leading-relaxed">
              Our flagship collection represents the evolution of luxury skincare. Each
              product is meticulously crafted with proprietary ingredients sourced from
              the world&apos;s most exclusive suppliers.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 space-y-4"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary font-bold">01</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Pure Ingredients</h4>
                  <p className="text-foreground/70 text-sm">
                    All-natural formulations with zero harmful additives
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary font-bold">02</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Scientific Innovation</h4>
                  <p className="text-foreground/70 text-sm">
                    Backed by 15+ years of dermatological research
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-primary font-bold">03</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Sustainable Luxury</h4>
                  <p className="text-foreground/70 text-sm">
                    Eco-conscious practices without compromising quality
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.a
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              href="#"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              Explore Collection
              <ArrowRight size={20} />
            </motion.a>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden"
          >
            <Image
              src="/images/featured-luxury.png"
              alt="Essence Premium Collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
