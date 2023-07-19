import Image from 'next/image';

export default function Logo({
  width = 150,
  height = 75,
  alt = 'Samkaup',
  variant = 'white',
}) {
  let src = '/logos/samkaup_logo.png';
  if (variant !== 'white') {
    src = '/logos/samkaup_logo_blue.png';
  }
  return (
    <>
      <Image src={src} width={width} height={height} alt={alt} />
    </>
  );
}
