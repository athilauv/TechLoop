import { useExampleTypes } from "../../../../../hooks/useLookups.ts";
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
    const { data: exampleTypes = [] } = useExampleTypes();
    const options = [
        { value: "", label: "None" },
        ...(exampleTypes ?? []).map((item) => ({
            value: String(item.id),
            label: item.name,
        })),
    ];

    return (
        <div>
            <CustomSelect
                value={value}
                onChange={(value: string) => onChange(value)}
                options={options}
            />

            {error && (
                <p className="mt-1 text-xs text-[var(--cs-danger)]">
                    {error}
                </p>
            )}
        </div>
    );
}