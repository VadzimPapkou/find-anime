import { Button } from "antd";
import styles from './switch.module.scss';

export type TSwitchOption = { icon: string; value: string };

type TSwitchProps = {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    options: TSwitchOption[];
};

export function Switch({
    value,
    onChange,
    disabled = false,
    options,
}: TSwitchProps) {
    return (
        <div className={styles.switchContainer}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    type={value === option.value ? 'primary' : 'default'}
                    onClick={() => !disabled && onChange?.(option.value)}
                    disabled={disabled}
                    size="middle"
                    className={styles.switchButton}
                    icon={<span className="material-icons">{option.icon}</span>}
                />
            ))}
        </div>
    );
}

