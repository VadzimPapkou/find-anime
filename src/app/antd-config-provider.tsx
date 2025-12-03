import { ConfigProvider } from "antd";
import ruLocale from "antd/locale/ru_RU"
import type { ReactNode } from "react";

type TAntdConfigProviderProps = {
    children: ReactNode | ReactNode[];
}

export function AntdConfigProvider({children}: TAntdConfigProviderProps) {
    return (
        <ConfigProvider locale={ ruLocale }>
            { children }
        </ConfigProvider>
    );
}