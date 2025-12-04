import { SearchForm, type TSearchFormState } from "../features/search-form/search-form.tsx";
import styles from './app.module.scss';
import { Divider, Form, type FormInstance, Typography } from "antd";
import { useMemo, useState } from "react";
import { constructAniDBUrl } from "../features/search-form/construct-url.ts";
import Link from "antd/es/typography/Link";

function App() {
    const [searchForm, setSearchForm] = useState<FormInstance<TSearchFormState>>();
    const fields = Form.useWatch<TSearchFormState | undefined>([], searchForm);

    const aniDbUrl = useMemo(() => {
        if (!fields) return null;

        return constructAniDBUrl(fields)
    }, [fields]);

    return (
        <div className={ styles.app }>
            <Typography.Title level={ 2 } style={ {color: 'var(--ant-color-link)'} }>Найти аниме</Typography.Title>
            <Divider/>
            <SearchForm onForm={ setSearchForm }/>
            { aniDbUrl && <>
                <Divider/>
                <Typography.Title level={ 2 } style={ {color: 'var(--ant-color-link)'} }>Итоговая
                ссылка</Typography.Title>
                <Link href={ aniDbUrl } target="_blank">{ aniDbUrl }</Link>
            </> }
        </div>
    )
}

export default App
