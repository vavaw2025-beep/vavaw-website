'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Globe, Users, Lightbulb } from 'lucide-react';
import { companyInfo } from '@/lib/data';

export function CompanyStory() {
  const stats = [
    {
      icon: Users,
      value: companyInfo.team,
      label: 'Team Members',
    },
    {
      icon: Globe,
      value: '45+',
      label: 'Countries',
    },
    {
      icon: Lightbulb,
      value: '20+',
      label: 'Years of Innovation',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-wider">
            Our Legacy
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {companyInfo.name}
          </h2>
          <p className="mt-4 text-xl text-foreground/80 font-semibold">
            {companyInfo.tagline}
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 md:h-full min-h-96 rounded-lg overflow-hidden"
          >
            <Image
              src="/images/company-heritage.png"
              alt="Company Heritage"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-foreground/80 leading-relaxed">
              {companyInfo.description}
            </p>

            <p className="mt-6 text-lg text-foreground/80 leading-relaxed">
              {companyInfo.mission}
            </p>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-foreground/70 text-sm mt-1">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
