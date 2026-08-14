import useInView from '../hooks/useInView'

const VARIANT_CLASS = {
  fade: '',
  pop: ' reveal--pop',
  swing: ' reveal--swing',
  zoom: ' reveal--zoom',
}

// Wraps children with a scroll-triggered entrance animation.
// variant: 'fade' (default) | 'pop' | 'swing' | 'zoom'
export default function Reveal({
  as: Tag = 'div',
  variant = 'fade',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const { ref, inView } = useInView()

  const delayClass =
    delay === 1
      ? ' reveal-delay-1'
      : delay === 2
        ? ' reveal-delay-2'
        : delay === 3
          ? ' reveal-delay-3'
          : delay === 4
            ? ' reveal-delay-4'
            : ''

  return (
    <Tag
      ref={ref}
      className={`reveal${VARIANT_CLASS[variant] || ''}${delayClass}${inView ? ' is-inview' : ''}${className ? ' ' + className : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
