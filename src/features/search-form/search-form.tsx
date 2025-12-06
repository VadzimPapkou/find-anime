import { DatePicker, Flex, Form, type FormInstance, InputNumber, Select, Spin, TreeSelect, Typography } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import styles from './search-form.module.scss';
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { useTagsQuery } from "../../shared/api/use-tags-query.ts";
import { Switch, type TSwitchOption } from "../../shared/ui/switch/switch.tsx";
import { useTagsTree } from "../../shared/api/use-tags-tree.ts";
import type { TLanguage } from "../../shared/types/language.ts";
import { useTagsTreeOptions } from "./use-tags-tree-options.ts";

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
    language?: TLanguage;
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
    sortType: 'rating',
}

export function SearchForm({onForm, language = 'rus'}: TSearchFormProps) {
    const tagsQuery = useTagsQuery({language: language});
    const tagsTreeQuery = useTagsTree();
    const tagsTreeOptions = useTagsTreeOptions({ tagsTreeQuery, tagsQuery, language });

    console.log(tagsTreeOptions);

    const [form] = Form.useForm<TSearchFormState>();

    useEffect(() => {
        onForm?.(form);
    }, [form, onForm]);

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
                            <TreeSelect
                                showSearch={{
                                    treeNodeFilterProp: 'title'
                                }}
                                treeData={ tagsTreeOptions }
                                multiple
                                placeholder="Жанры, темы, страна"/>
                        </Form.Item>
                    </Spin>
                </div>
            </div>
        </Form>
    );
}