import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export default function Avatar(props: {
  image: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        'w-10 h-10 rounded bg-gray-200 overflow-hidden',
        props.className
      )}
    >
      <Image src={props.image} alt={props.alt} width={40} height={40} />
    </div>
  );
}
