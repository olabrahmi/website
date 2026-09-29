'use client';

import { Button, Download } from '@/components/ui';
import { person } from '@/content/site';
import { useCvDownload } from '@/hooks/use-cv-download';

/** Hero "Download CV". Swaps to an email link once the download limit is reached. */
export default function DownloadCvButton() {
  const { blocked, onClick } = useCvDownload();

  if (blocked) {
    return (
      <Button href={`mailto:${person.email}?subject=CV`} variant="secondary">
        Limit reached, email me
      </Button>
    );
  }

  return (
    <Button href={person.cvPath} download variant="secondary" onClick={onClick}>
      Download CV
      <Download className="btn-arrow btn-arrow-down" />
    </Button>
  );
}
