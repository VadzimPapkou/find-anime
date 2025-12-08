import { ConfigProvider } from "antd";
import ruLocale from "antd/locale/ru_RU"
import type { ReactNode } from "react";

type TAntdConfigProviderProps = {
    children: ReactNode | ReactNode[];
}

export function AntdConfigProvider({children}: TAntdConfigProviderProps) {
    return (
        <ConfigProvider locale={ ruLocale } theme={ {
            token: {
                fontFamily: 'Montserrat',
                fontSizeHeading1: 32,
                fontSizeHeading2: 24,
                fontSizeHeading3: 20,
                fontSizeHeading4: 16,
                fontSizeHeading5: 14,
            },
            components: {
                Typography: {
                    lineHeightHeading1: 1.2,
                    lineHeightHeading2: 1.2,
                    lineHeightHeading3: 1.2,
                    lineHeightHeading4: 1.2,
                    lineHeightHeading5: 1.2,
                },
            }

        } }>
            { children }
        </ConfigProvider>
    );
}