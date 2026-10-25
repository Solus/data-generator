import IbanGenerator from '@/components/IbanGenerator';
import PageIntro from '@/components/PageIntro';

export default function IbanPage() {
  return (
    <>
      <PageIntro page="iban" />
      <IbanGenerator />
    </>
  );
}
