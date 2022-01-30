import Image from 'next/image';

export default function Logo() {
  return (
    <div>
      <Image src='/images/logo.svg' alt='logo' width={240} height={26}/>
    </div>
  );
}
