import { ExampleType } from "../../../../../types/enums/example-type";
import CustomSelect from "../../../../../shared/Customselect";

interface ExampleTypeSelectProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function ExampleTypeSelect({
                                              value,
                                              onChange,
                                              error,
                                          }: ExampleTypeSelectProps) {
    return (
        <div>
            <CustomSelect
                value={value}
                onChange={(value: string) => onChange(value)}
                options={[
                    { value: "", label: "None" },
                    { value: String(ExampleType.Text), label: "Text" },
                    { value: String(ExampleType.Code), label: "Code" },
                    { value: String(ExampleType.Link), label: "Link" },
                    { value: String(ExampleType.Image), label: "Image" },
                    { value: String(ExampleType.Video), label: "Video" },
                    { value: String(ExampleType.Pdf), label: "PDF" },
                ]}
            />

            {error && (
                <p className="mt-1 text-xs text-[var(--cs-danger)]">
                    {error}
                </p>
            )}
        </div>
    );
}