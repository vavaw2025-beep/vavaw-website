'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export function ContactCTA() {
  const contacts = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      href: 'tel:+15551234567',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@prestige.com',
      href: 'mailto:hello@prestige.com',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'New York, USA',
      href: '#',
    },
  ];

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
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <p className="text-primary text-sm font-semibold uppercase tracking-wider">
            Get in Touch
          </p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Let&apos;s Create Something Extraordinary
          </h2>
          <p className="mt-6 text-lg text-foreground/70">
            Whether you&apos;re interested in our brands, business opportunities, or have
            questions, we&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          {contacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <motion.a
                key={idx}
                variants={itemVariants}
                href={contact.href}
                className="group relative p-8 rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <h3 className="text-sm font-semibold text-foreground/70">{contact.label}</h3>
                <p className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {contact.value}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Connect</span>
                  <ArrowRight size={16} />
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative p-12 md:p-16 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />

          <div className="relative z-10 max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Work Together?
            </h3>
            <p className="mt-4 text-lg text-foreground/70">
              Join our growing network of partners and clients who trust Prestige
              Holdings to deliver exceptional results.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8"
            >
              <Link
                href="mailto:hello@prestige.com"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
              >
                Send us a Message
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-border/50 text-center text-foreground/60 text-sm"
        >
          <p>
            &copy; 2024 Prestige Holdings. All rights reserved. | Crafting Exceptional
            Experiences
          </p>
        </motion.div>
      </div>
    </section>
  );
}
