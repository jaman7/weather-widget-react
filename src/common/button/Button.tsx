import classNames from 'classnames';
import React, { useCallback } from 'react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import './Button.scss';
import { Tooltip } from 'primereact/tooltip';

export type TypeButton = 'button' | 'submit' | 'reset';

export interface IButtonComponent {
  name?: string;
  id?: string;
  children?: JSX.Element | React.ReactNode;
  className?: string;
  customClass?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  type?: TypeButton;
  round?: boolean;
  disabled?: boolean;
  tooltip?: string;
  iconType?: string;
  buttonsConfig?: IButtonComponent[];
}

const Button: React.FC<IButtonComponent> = React.memo((props: IButtonComponent) => {
  const { buttonsConfig } = props || {};
  const { t } = useTranslation();

  const buttonRender = useCallback(
    (btn: IButtonComponent, index = 0): JSX.Element => {
      const buttonClassNames = classNames('button-component', btn.className || 'default-button', btn.customClass, {
        'ms-2': buttonsConfig?.length && index > 0,
        round: btn.round,
        isDisabled: btn.disabled,
      });

      return (
        <button
          key={btn.id || index}
          className={buttonClassNames}
          onClick={btn.handleClick}
          type={btn.type || 'button'}
          disabled={btn.disabled}
          data-pr-tooltip={t(btn?.tooltip as string)}
          data-pr-position="top"
        >
          {btn.name ? t(btn.name) : btn.children}
        </button>
      );
    },
    [buttonsConfig, t]
  );

  return (
    <>
      <Tooltip target=".button-component" />
      {!buttonsConfig?.length ? buttonRender(props) : <div className="d-flex">{buttonsConfig?.map((btn, i) => buttonRender(btn, i))}</div>}
    </>
  );
});

export default Button;
