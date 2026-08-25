/**
 * next-intl –  Documentation: https://next-intl.dev/docs/getting-started/app-router
 * Based on the official next-intl App Router internationalization, customized for project-specific requirements.
 */

import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
