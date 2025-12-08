import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/app.tsx'
import { queryClient } from "./shared/api/query-client.ts";
import { AntdConfigProvider } from './app/antd-config-provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import 'material-icons/iconfont/material-icons.css';
import './shared/antd/ant-global.scss';
import './shared/fonts.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AntdConfigProvider>
            <QueryClientProvider client={ queryClient }>
                <App/>
            </QueryClientProvider>
        </AntdConfigProvider>
    </StrictMode>,
)
