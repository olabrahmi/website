import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { cn } from '@/utils/cn';

type ContainerProps<T extends ElementType> = { as?: T } & ComponentPropsWithoutRef<T>;

export default function Container<T extends ElementType = 'div'>({ as, className, ...props }: ContainerProps<T>) {
  const Component: ElementType = as ?? 'div';

  return <Component className={cn('mx-auto w-full max-w-[1040px] px-5 sm:px-8', className)} {...props} />;
}
