/**
 * next-intl – Documentation: https://next-intl.dev/docs/routing/setup
 * Based on the official next-intl App Router internationalization.
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
