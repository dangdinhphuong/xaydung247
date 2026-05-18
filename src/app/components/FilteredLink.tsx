import * as React from 'react';
import { Link, type LinkProps } from 'react-router';
import { filterFigmaProps } from './ui/utils';

/**
 * A wrapper around react-router's Link component that filters out Figma inspector props
 * to avoid React DOM warnings when using Link with Button's asChild prop
 */
export const FilteredLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const cleanProps = filterFigmaProps(props as any);
    return <Link ref={ref} {...cleanProps} />;
  }
);

FilteredLink.displayName = 'FilteredLink';
