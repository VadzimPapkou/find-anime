import { DatePicker, Flex, Form, type FormInstance, InputNumber, Select, Spin, Typography } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import styles from './search-form.module.scss';
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo } from "react";
import { useTagsQuery } from "../../shared/api/use-tags-query.ts";

const nextYear = dayjs().add(1, 'year');

const sortTypeOptions: DefaultOptionType[] = [
    {label: 'Рейтингу', value: 'rating'},
    {label: 'Году выпуска', value: 'year'},
];

const sortDirectionOptions: DefaultOptionType[] = [
    {label: 'По убыванию', value: 'asc'},
    {label: 'По возрастанию', value: 'desc'},
]

export type TSearchFormState = Partial<{
    sortType: string;
    sortDirection: string;
    episodesMin: number;
    episodesMax: number;
    startYear: [Dayjs, Dayjs];
}>;

type TSearchFormProps = {
    onForm?: (form: FormInstance<TSearchFormState>) => void;
}

export function SearchForm({onForm}: TSearchFormProps) {
    const tagsQuery = useTagsQuery();
    const [form] = Form.useForm<TSearchFormState>();
    console.log(tagsQuery.data)
    useEffect(() => {
        onForm?.(form);
    }, [form, onForm]);
    const fields = Form.useWatch<TSearchFormState | undefined>([], form);

    const tagsOptions = useMemo(() => {
        if (!tagsQuery.data) return undefined;

        return tagsQuery.data.map(tag => ({
            ...tag,
            value: tag.id,
            label: tag.name,
        }))
    }, [tagsQuery.data]);

    return (
        <Form form={ form } className={ styles.form } initialValues={ {} }>
            <div className={ styles.column }>
                <div className={ styles.episodesCount }>
                    <Typography.Title level={ 3 }>Число эпизодов</Typography.Title>
                    <Flex gap="small">
                        <Form.Item name="episodesMin">
                            <InputNumber min={ 1 } placeholder="От"/>
                        </Form.Item>
                        <Form.Item name="episodesMax">
                            <InputNumber min={ 1 } placeholder="До"/>
                        </Form.Item>
                    </Flex>
                </div>

                <Typography.Title level={ 3 }>Год выпуска</Typography.Title>
                <Form.Item name={ "startYear" } layout="vertical">
                    <DatePicker.RangePicker
                        className={ styles.datePicker }
                        picker="year" placeholder={ ["От", "До"] }
                        maxDate={ nextYear }
                    />
                </Form.Item>
            </div>
            <div className={ styles.column }>
                <div>
                    <Typography.Title level={ 3 }>Сортировка</Typography.Title>
                    <Form.Item name={ "sortType" }>
                        <Select options={ sortTypeOptions } placeholder="Тип сортировки"/>
                    </Form.Item>
                    <Form.Item name={ "sortDirection" } label="Направление сортировки" layout="vertical">
                        <Select options={ sortDirectionOptions } disabled={ !fields?.sortType }
                            placeholder="По убыванию"/>
                    </Form.Item>
                </div>
                <div>
                    <Typography.Title level={ 3 }>Теги</Typography.Title>
                    <Spin spinning={ tagsQuery.isFetching }>
                        <Form.Item>
                            <Select mode="multiple" options={ tagsOptions }/>
                        </Form.Item>
                    </Spin>
                </div>
            </div>
        </Form>
    );
}