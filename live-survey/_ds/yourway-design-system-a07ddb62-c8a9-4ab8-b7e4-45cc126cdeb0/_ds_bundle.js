/* @ds-bundle: {"format":3,"namespace":"YourwayDesignSystem_a07ddb","components":[{"name":"Accordion","sourcePath":"components/core/Accordion.jsx"},{"name":"AccordionItem","sourcePath":"components/core/Accordion.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Menu","sourcePath":"components/core/Menu.jsx"},{"name":"MenuItem","sourcePath":"components/core/Menu.jsx"},{"name":"MenuDivider","sourcePath":"components/core/Menu.jsx"},{"name":"Progress","sourcePath":"components/core/Progress.jsx"},{"name":"RadioGroup","sourcePath":"components/core/Radio.jsx"},{"name":"Radio","sourcePath":"components/core/Radio.jsx"},{"name":"Separator","sourcePath":"components/core/Separator.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"TabList","sourcePath":"components/core/Tabs.jsx"},{"name":"Tab","sourcePath":"components/core/Tabs.jsx"},{"name":"TabPanel","sourcePath":"components/core/Tabs.jsx"},{"name":"Textarea","sourcePath":"components/core/Textarea.jsx"},{"name":"Tooltip","sourcePath":"components/core/Tooltip.jsx"}],"sourceHashes":{"components/core/Accordion.jsx":"187c42137ac7","components/core/Avatar.jsx":"c9630845b550","components/core/Badge.jsx":"02807b65f6b7","components/core/Button.jsx":"8bec71e7aebc","components/core/Card.jsx":"23cdafa5b439","components/core/Input.jsx":"d80a7a0cdee4","components/core/Menu.jsx":"508d23f98850","components/core/Progress.jsx":"6636c9d7345d","components/core/Radio.jsx":"4156cc0b2d57","components/core/Separator.jsx":"fc8c113e169c","components/core/Tabs.jsx":"c6c2374b532d","components/core/Textarea.jsx":"5ddb93d6d4e8","components/core/Tooltip.jsx":"708b9cc85a3a"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.YourwayDesignSystem_a07ddb = window.YourwayDesignSystem_a07ddb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Accordion.jsx
try { (() => {
function Accordion({
  children,
  allowMultiple = false,
  style = {}
}) {
  const [openItems, setOpenItems] = React.useState([]);
  const toggle = value => {
    if (allowMultiple) {
      setOpenItems(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    } else {
      setOpenItems(prev => prev.includes(value) ? [] : [value]);
    }
  };
  return React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style
    }
  }, React.Children.map(children, (child, i) => child ? React.cloneElement(child, {
    isOpen: openItems.includes(child.props.value),
    onToggle: toggle,
    isLast: i === React.Children.count(children) - 1
  }) : null));
}
function AccordionItem({
  children,
  value,
  title,
  isOpen,
  onToggle,
  isLast,
  style = {}
}) {
  const [hovered, setHovered] = React.useState(false);
  const ChevronIcon = () => React.createElement('svg', {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style: {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 200ms ease',
      flexShrink: 0
    }
  }, React.createElement('polyline', {
    points: '6 9 12 15 18 9'
  }));
  return React.createElement('div', {
    style: {
      borderBottom: isLast ? 'none' : '1px solid var(--color-border)',
      ...style
    }
  }, React.createElement('button', {
    onClick: () => onToggle && onToggle(value),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 'var(--space-4)',
      background: hovered ? 'var(--color-primary-light)' : '#fff',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      fontWeight: isOpen ? 600 : 400,
      color: isOpen ? 'var(--color-primary)' : 'var(--color-text-high)',
      textAlign: 'left',
      transition: 'background var(--transition-fast), color var(--transition-fast)'
    }
  }, React.createElement('span', null, title), React.createElement(ChevronIcon)), isOpen && React.createElement('div', {
    style: {
      padding: 'var(--space-2) var(--space-4) var(--space-4)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-medium)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children));
}
Object.assign(__ds_scope, { Accordion, AccordionItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function Avatar({
  name = '',
  size = 'md',
  src,
  style = {}
}) {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72
  };
  const px = sizes[size] || 40;
  const fontSize = px * 0.38;
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  const containerStyle = {
    width: px,
    height: px,
    borderRadius: '50%',
    background: src ? 'transparent' : 'var(--color-avatar-bg)',
    color: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    fontSize,
    overflow: 'hidden',
    flexShrink: 0,
    ...style
  };
  if (src) {
    return React.createElement('div', {
      style: containerStyle
    }, React.createElement('img', {
      src,
      alt: name,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }));
  }
  return React.createElement('div', {
    style: containerStyle
  }, initials || '?');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  children,
  variant = 'default',
  size = 'md',
  style = {}
}) {
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    borderRadius: 'var(--radius-badge)',
    lineHeight: 1,
    whiteSpace: 'nowrap'
  };
  const sizes = {
    sm: {
      fontSize: '0.625rem',
      padding: '2px 6px',
      height: '1.125rem'
    },
    md: {
      fontSize: 'var(--text-xs)',
      padding: '3px 8px',
      height: '1.375rem'
    },
    lg: {
      fontSize: 'var(--text-sm)',
      padding: '4px 10px',
      height: '1.625rem'
    }
  };
  const variants = {
    default: {
      background: 'var(--color-blue-50)',
      color: 'var(--color-blue-700)'
    },
    pro: {
      background: 'var(--color-pro)',
      color: 'var(--color-text-high)'
    },
    beta: {
      background: 'var(--color-primary)',
      color: '#fff'
    },
    success: {
      background: 'var(--color-green-100)',
      color: '#3C541A'
    },
    error: {
      background: '#FFEFF0',
      color: '#C60613'
    },
    new: {
      background: 'var(--color-gleeful-50)',
      color: 'var(--color-gleeful-800)'
    },
    draft: {
      background: 'var(--color-gray-50)',
      color: 'var(--color-gray-300)'
    },
    neutral: {
      background: 'var(--color-bg-app)',
      color: 'var(--color-text-medium)',
      border: '1px solid var(--color-border)'
    }
  };
  return React.createElement('span', {
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function Button({
  children,
  variant = 'solid',
  size = 'md',
  disabled = false,
  onClick,
  style = {},
  ...props
}) {
  const base = {
    fontFamily: 'var(--font-sans)',
    fontWeight: 500,
    borderRadius: 'var(--radius-btn)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'background var(--transition-fast), opacity var(--transition-fast)',
    opacity: disabled ? 0.45 : 1,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  };
  const sizes = {
    xs: {
      fontSize: 'var(--text-xs)',
      padding: '0.375rem 0.625rem',
      height: '1.75rem'
    },
    sm: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--space-btn-y-sm) var(--space-btn-x-sm)',
      height: '2rem'
    },
    md: {
      fontSize: 'var(--text-md)',
      padding: 'var(--space-btn-y-md) var(--space-btn-x-md)',
      height: '2.5rem'
    },
    lg: {
      fontSize: 'var(--text-md)',
      padding: 'var(--space-btn-y-lg) var(--space-btn-x-lg)',
      height: '3rem'
    }
  };
  const variants = {
    solid: {
      background: 'var(--color-primary)',
      color: '#fff'
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      border: '1.5px solid var(--color-primary)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-medium)',
      border: 'none'
    },
    danger: {
      background: 'var(--color-error)',
      color: '#fff'
    },
    pro: {
      background: 'var(--color-pro)',
      color: 'var(--color-text-high)'
    }
  };
  const merged = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  return React.createElement('button', {
    style: merged,
    disabled,
    onClick,
    ...props
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  title,
  subtitle,
  body,
  topBarActions,
  children,
  onClick,
  style = {},
  isPro = false
}) {
  const [hovered, setHovered] = React.useState(false);
  const cardStyle = {
    background: 'var(--color-surface-card)',
    borderRadius: 'var(--radius-card)',
    boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-card)',
    padding: 'var(--space-card-pad)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'box-shadow var(--transition-base), transform var(--transition-base)',
    transform: hovered && onClick ? 'translateY(-1px)' : 'none',
    fontFamily: 'var(--font-sans)',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };
  const titleStyle = {
    fontSize: 'var(--text-md)',
    fontWeight: 600,
    color: 'var(--color-text-high)',
    lineHeight: 'var(--leading-snug)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };
  const subtitleStyle = {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-low)',
    fontWeight: 400
  };
  const bodyStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-medium)',
    lineHeight: 'var(--leading-relaxed)',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical'
  };
  const topBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 'var(--space-2)'
  };
  return React.createElement('div', {
    style: cardStyle,
    onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, topBarActions && React.createElement('div', {
    style: topBarStyle
  }, topBarActions), title && React.createElement('div', {
    style: titleStyle
  }, title), subtitle && React.createElement('div', {
    style: subtitleStyle
  }, subtitle), body && React.createElement('div', {
    style: bodyStyle
  }, body), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  type = 'text',
  error,
  hint,
  disabled = false,
  value,
  onChange,
  style = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    fontFamily: 'var(--font-sans)',
    width: '100%'
  };
  const labelStyle = {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-high)',
    lineHeight: 1.5
  };
  const inputStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-md)',
    fontWeight: 400,
    color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-high)',
    background: disabled ? '#F7F8FA' : '#fff',
    border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-input)',
    padding: 'var(--space-input-y) var(--space-input-x)',
    height: '2.5rem',
    width: '100%',
    outline: 'none',
    boxShadow: focused ? 'var(--shadow-focus-blue)' : 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    cursor: disabled ? 'not-allowed' : 'text',
    ...style
  };
  const hintStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--color-error)' : 'var(--color-text-low)',
    marginTop: '2px'
  };
  return React.createElement('div', {
    style: containerStyle
  }, label && React.createElement('label', {
    style: labelStyle
  }, label), React.createElement('input', {
    type,
    placeholder,
    disabled,
    value,
    onChange,
    style: inputStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    ...props
  }), (error || hint) && React.createElement('span', {
    style: hintStyle
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Menu.jsx
try { (() => {
function Menu({
  trigger,
  children,
  placement = 'bottom-start',
  style = {}
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const placements = {
    'bottom-start': {
      top: '100%',
      left: 0,
      marginTop: '4px'
    },
    'bottom-end': {
      top: '100%',
      right: 0,
      marginTop: '4px'
    },
    'top-start': {
      bottom: '100%',
      left: 0,
      marginBottom: '4px'
    }
  };
  return React.createElement('div', {
    ref,
    style: {
      position: 'relative',
      display: 'inline-flex',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, React.createElement('div', {
    onClick: () => setOpen(v => !v)
  }, trigger), open && React.createElement('div', {
    role: 'menu',
    style: {
      position: 'absolute',
      ...(placements[placement] || placements['bottom-start']),
      background: '#fff',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-dropdown)',
      minWidth: '160px',
      zIndex: 'var(--z-dropdown)',
      padding: 'var(--space-1) 0',
      display: 'flex',
      flexDirection: 'column'
    }
  }, React.Children.map(children, child => child ? React.cloneElement(child, {
    onClose: () => setOpen(false)
  }) : null)));
}
function MenuItem({
  children,
  onClick,
  onClose,
  danger = false,
  disabled = false,
  icon,
  style = {}
}) {
  const [hovered, setHovered] = React.useState(false);
  return React.createElement('button', {
    role: 'menuitem',
    disabled,
    onClick: () => {
      if (!disabled) {
        onClick && onClick();
        onClose && onClose();
      }
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--space-2) var(--space-4)',
      background: hovered && !disabled ? 'var(--color-primary-light)' : 'transparent',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: 400,
      color: danger ? 'var(--color-error)' : disabled ? 'var(--color-text-disabled)' : 'var(--color-text-high)',
      textAlign: 'left',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--transition-fast)',
      ...style
    }
  }, icon && React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0
    }
  }, icon), children);
}
function MenuDivider() {
  return React.createElement('div', {
    style: {
      height: '1px',
      background: 'var(--color-border-light)',
      margin: 'var(--space-1) 0'
    }
  });
}
Object.assign(__ds_scope, { Menu, MenuItem, MenuDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Menu.jsx", error: String((e && e.message) || e) }); }

// components/core/Progress.jsx
try { (() => {
function Progress({
  value = 0,
  max = 100,
  size = 'md',
  color,
  label,
  showValue = false,
  style = {}
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  const fillColor = color || 'var(--color-primary)';
  const sizes = {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px'
  };
  const trackStyle = {
    width: '100%',
    height: sizes[size] || sizes.md,
    background: 'var(--color-border)',
    borderRadius: 'var(--radius-full)',
    overflow: 'hidden',
    ...style
  };
  const rangeStyle = {
    width: `${pct}%`,
    height: '100%',
    background: fillColor,
    borderRadius: 'var(--radius-full)',
    transition: 'width var(--transition-slow)'
  };
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    fontFamily: 'var(--font-sans)',
    width: '100%'
  };
  const metaStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-low)'
  };
  return React.createElement('div', {
    style: containerStyle
  }, (label || showValue) && React.createElement('div', {
    style: metaStyle
  }, label && React.createElement('span', null, label), showValue && React.createElement('span', null, `${Math.round(pct)}%`)), React.createElement('div', {
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemax': max,
    style: trackStyle
  }, React.createElement('div', {
    style: rangeStyle
  })));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Progress.jsx", error: String((e && e.message) || e) }); }

// components/core/Radio.jsx
try { (() => {
function RadioGroup({
  children,
  value,
  onChange,
  label,
  direction = 'vertical',
  style = {}
}) {
  return React.createElement('div', {
    role: 'radiogroup',
    style: {
      display: 'flex',
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      gap: direction === 'horizontal' ? 'var(--space-5)' : 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, React.Children.map(children, child => child ? React.cloneElement(child, {
    groupValue: value,
    onChange
  }) : null));
}
function Radio({
  children,
  value,
  groupValue,
  onChange,
  disabled = false,
  style = {}
}) {
  const checked = groupValue === value;
  const [hovered, setHovered] = React.useState(false);
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    ...style
  };
  const outerStyle = {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    flexShrink: 0,
    border: `2px solid ${checked ? 'var(--color-primary)' : hovered ? 'var(--color-blue-300)' : 'var(--color-border)'}`,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color var(--transition-fast)',
    boxShadow: checked ? 'var(--shadow-focus-blue)' : 'none'
  };
  const innerStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: checked ? 'var(--color-primary)' : 'transparent',
    transition: 'background var(--transition-fast)'
  };
  const labelStyle = {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-high)',
    fontWeight: checked ? 500 : 400,
    userSelect: 'none',
    lineHeight: 1.5
  };
  return React.createElement('label', {
    style: containerStyle,
    onMouseEnter: () => !disabled && setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, React.createElement('input', {
    type: 'radio',
    value,
    checked,
    disabled,
    onChange: () => !disabled && onChange && onChange(value),
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }), React.createElement('div', {
    style: outerStyle
  }, React.createElement('div', {
    style: innerStyle
  })), React.createElement('span', {
    style: labelStyle
  }, children));
}
Object.assign(__ds_scope, { RadioGroup, Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Radio.jsx", error: String((e && e.message) || e) }); }

// components/core/Separator.jsx
try { (() => {
function Separator({
  orientation = 'horizontal',
  style = {}
}) {
  const isHorizontal = orientation === 'horizontal';
  return React.createElement('div', {
    role: 'separator',
    'aria-orientation': orientation,
    style: {
      background: 'var(--color-border-light)',
      width: isHorizontal ? '100%' : '1px',
      height: isHorizontal ? '1px' : '100%',
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Separator.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function Tabs({
  children,
  defaultTab,
  onChange,
  style = {}
}) {
  const tabs = React.Children.toArray(children).filter(c => c.type === TabPanel || c.props['data-tab'] !== undefined);
  const allTabs = React.Children.toArray(children);
  const tabList = allTabs.find(c => c.type === TabList);
  const panels = allTabs.filter(c => c.type === TabPanel);
  const firstTab = tabList ? React.Children.toArray(tabList.props.children)[0]?.props?.value : undefined;
  const [active, setActive] = React.useState(defaultTab || firstTab);
  const handleChange = val => {
    setActive(val);
    onChange && onChange(val);
  };
  return React.createElement('div', {
    style: {
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, tabList && React.cloneElement(tabList, {
    active,
    onChange: handleChange
  }), panels.map(p => React.cloneElement(p, {
    active
  })));
}
function TabList({
  children,
  active,
  onChange,
  style = {}
}) {
  return React.createElement('div', {
    role: 'tablist',
    style: {
      display: 'flex',
      gap: '0',
      borderBottom: '2px solid var(--color-border)',
      ...style
    }
  }, React.Children.map(children, child => child ? React.cloneElement(child, {
    active,
    onChange
  }) : null));
}
function Tab({
  children,
  value,
  active,
  onChange,
  style = {}
}) {
  const [hovered, setHovered] = React.useState(false);
  const isActive = active === value;
  return React.createElement('button', {
    role: 'tab',
    'aria-selected': isActive,
    onClick: () => onChange && onChange(value),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? 'var(--color-primary)' : hovered ? 'var(--color-text-medium)' : 'var(--color-text-low)',
      background: 'none',
      border: 'none',
      borderBottom: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
      padding: 'var(--space-2) var(--space-4)',
      marginBottom: '-2px',
      cursor: 'pointer',
      transition: 'color var(--transition-fast), border-color var(--transition-fast)',
      ...style
    }
  }, children);
}
function TabPanel({
  children,
  value,
  active,
  style = {}
}) {
  if (active !== value) return null;
  return React.createElement('div', {
    role: 'tabpanel',
    style: {
      paddingTop: 'var(--space-4)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Tabs, TabList, Tab, TabPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/core/Textarea.jsx
try { (() => {
function Textarea({
  label,
  placeholder,
  error,
  hint,
  disabled = false,
  rows = 4,
  value,
  onChange,
  style = {},
  ...props
}) {
  const [focused, setFocused] = React.useState(false);
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-1)',
    fontFamily: 'var(--font-sans)',
    width: '100%'
  };
  const labelStyle = {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--color-text-high)',
    lineHeight: 1.5
  };
  const textareaStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-md)',
    fontWeight: 400,
    color: disabled ? 'var(--color-text-disabled)' : 'var(--color-text-high)',
    background: disabled ? '#F7F8FA' : '#fff',
    border: `1.5px solid ${error ? 'var(--color-error)' : focused ? 'var(--color-primary)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-input)',
    padding: 'var(--space-input-y) var(--space-input-x)',
    width: '100%',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 'var(--leading-normal)',
    boxShadow: focused ? 'var(--shadow-focus-blue)' : 'none',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
    cursor: disabled ? 'not-allowed' : 'text',
    ...style
  };
  const hintStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--color-error)' : 'var(--color-text-low)'
  };
  return React.createElement('div', {
    style: containerStyle
  }, label && React.createElement('label', {
    style: labelStyle
  }, label), React.createElement('textarea', {
    rows,
    placeholder,
    disabled,
    value,
    onChange,
    style: textareaStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    ...props
  }), (error || hint) && React.createElement('span', {
    style: hintStyle
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/core/Tooltip.jsx
try { (() => {
function Tooltip({
  children,
  label,
  placement = 'top',
  style = {}
}) {
  const [visible, setVisible] = React.useState(false);
  const placements = {
    top: {
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginBottom: '6px'
    },
    bottom: {
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '6px'
    },
    left: {
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginRight: '6px'
    },
    right: {
      left: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: '6px'
    }
  };
  const tooltipStyle = {
    position: 'absolute',
    ...placements[placement],
    background: 'var(--color-gray-500)',
    color: '#fff',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    zIndex: 100,
    boxShadow: 'var(--shadow-md)',
    opacity: visible ? 1 : 0,
    transition: 'opacity var(--transition-fast)',
    ...style
  };
  return React.createElement('div', {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false)
  }, children, React.createElement('div', {
    role: 'tooltip',
    style: tooltipStyle
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tooltip.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.AccordionItem = __ds_scope.AccordionItem;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Menu = __ds_scope.Menu;

__ds_ns.MenuItem = __ds_scope.MenuItem;

__ds_ns.MenuDivider = __ds_scope.MenuDivider;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.TabList = __ds_scope.TabList;

__ds_ns.Tab = __ds_scope.Tab;

__ds_ns.TabPanel = __ds_scope.TabPanel;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Tooltip = __ds_scope.Tooltip;

})();
