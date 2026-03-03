"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700"
      >
        <motion.h1
          className="text-9xl font-extrabold text-primary-500 dark:text-primary-400 mb-4"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
        >
          404
        </motion.h1>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Halaman Tidak Ditemukan
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          Mohon maaf, kami tidak dapat menemukan halaman yang Anda cari. Alamat
          mungkin salah ketik atau halaman telah dipindahkan.
        </p>

        <Link href="/" passHref legacyBehavior>
          <motion.a
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-primary-600 hover:bg-primary-700 transition duration-300 transform hover:scale-[1.02]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali ke Beranda
          </motion.a>
        </Link>

        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          Jika Anda yakin ini adalah kesalahan, silakan hubungi administrator.
        </p>
      </motion.div>
    </main>
  );
}
