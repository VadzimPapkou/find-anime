import type { TTag } from "../../shared/api/use-tags-query.ts";
import type { SelectProps } from "antd";

type TRenderTag = SelectProps<TTag>["optionRender"];

export const renderTagOption: TRenderTag = ({label}) => {
    return <div>
        {label}
    </div>;
}