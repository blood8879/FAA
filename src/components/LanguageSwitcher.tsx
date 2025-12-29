'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'ko' : 'en';
    // Remove the current locale from the pathname and add the new one
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {locale === 'en' ? '한국어' : 'English'}
    </Button>
  );
}
