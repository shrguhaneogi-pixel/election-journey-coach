/**
 * Component render tests — Button UI primitive
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, disabled, className, 'aria-disabled': ariaDisabled, ...rest }: React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean; 'aria-disabled'?: boolean }) =>
      <button onClick={onClick} disabled={disabled} className={className} aria-disabled={ariaDisabled} {...rest}>{children}</button>,
  },
}));

import { Button } from '@/components/ui/Button';

describe('Button component', () => {
  it('renders children', () => {
    render(<Button>Next Step</Button>);
    expect(screen.getByRole('button', { name: /next step/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handler}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does NOT call onClick when disabled', async () => {
    const handler = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={handler} disabled>Disabled</Button>);
    // Click disabled button
    const btn = screen.getByRole('button');
    await user.click(btn);
    expect(handler).not.toHaveBeenCalled();
  });

  it('has aria-disabled=true when disabled', () => {
    render(<Button disabled>Locked</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('does NOT have aria-disabled when enabled', () => {
    render(<Button>Active</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'false');
  });

  it('renders with type="button" by default', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('renders with provided aria-label', () => {
    render(<Button aria-label="Start the journey">Go</Button>);
    expect(screen.getByRole('button', { name: 'Start the journey' })).toBeInTheDocument();
  });

  it('variant="disabled" makes the button disabled', () => {
    render(<Button variant="disabled">Unavailable</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});
