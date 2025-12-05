import { DatePicker, Flex, Form, type FormInstance, InputNumber, Select, Spin, Typography } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import styles from './search-form.module.scss';
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo } from "react";
import { type TTag, useTagsQuery } from "../../shared/api/use-tags-query.ts";
import { Switch, type TSwitchOption } from "../../shared/ui/switch/switch.tsx";
import type { TSelectOption } from "../../shared/types/t-select-option.ts";
import { renderTagOption } from "./render-tag-option.tsx";

export type TSearchFormState = Partial<{
    sortType: string;
    sortDirection: string;
    episodesMin: number;
    episodesMax: number;
    startYear: [Dayjs, Dayjs];
    tags: number[];
}>;

type TSearchFormProps = {
    onForm?: (form: FormInstance<TSearchFormState>) => void;
}

const nextYear = dayjs().add(1, 'year');

const sortTypeOptions: DefaultOptionType[] = [
    {label: 'Рейтинг', value: 'rating'},
    {label: 'Год выпуска', value: 'year'},
];

const sortDirectionOptions: TSwitchOption[] = [
    {icon: 'arrow_upward', value: 'asc'},
    {icon: 'arrow_downward', value: 'desc'},
];

const initialValues: TSearchFormState = {
    sortDirection: 'desc',
}

export function SearchForm({onForm}: TSearchFormProps) {
    const tagsQuery = useTagsQuery({language: "eng"});
    const [form] = Form.useForm<TSearchFormState>();

    useEffect(() => {
        onForm?.(form);
    }, [form, onForm]);

    const tagsOptions = useMemo<TSelectOption<TTag>[] | undefined>(() => {
        if (!tagsQuery.data) return undefined;

        return tagsQuery.data.map(tag => ({
            ...tag,
            value: tag.id,
            label: tag.name,
        }))
    }, [tagsQuery.data]);

    return (
        <Form form={ form } className={ styles.form } initialValues={ initialValues }>
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
                    <Form.Item className={ styles.sortDirection }>
                        <Form.Item className={ styles.sortTypeFormItem } name={ "sortType" }>
                            <Select options={ sortTypeOptions } placeholder="Тип сортировки"/>
                        </Form.Item>
                        <Form.Item name={ "sortDirection" }>
                            <Switch options={ sortDirectionOptions }/>
                        </Form.Item>
                    </Form.Item>
                </div>
                <div>
                    <Typography.Title level={ 3 }>Теги</Typography.Title>
                    <Spin spinning={ tagsQuery.isFetching }>
                        <Form.Item name="tags">
                            <Select mode="multiple"
                                options={ tagsOptions }
                                optionRender={ renderTagOption }
                                showSearch={ {optionFilterProp: 'label'} }
                                placeholder="Жанры, темы, страна"/>
                        </Form.Item>
                    </Spin>
                </div>
            </div>
        </Form>
    );
}