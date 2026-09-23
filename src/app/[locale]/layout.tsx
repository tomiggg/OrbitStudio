// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/routing";
import { ContactProvider } from "@/components/contact/ContactProvider";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ContactProvider>
        <PageViewTracker />
        {children}
      </ContactProvider>
    </NextIntlClientProvider>
  );
}