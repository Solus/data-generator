import NamesGenerator from '@/components/NamesGenerator';
import PageIntro from '@/components/PageIntro';

export default function NamesPage() {
  return (
    <>
      <PageIntro page="names" />
      <NamesGenerator />
    </>
  );
}
