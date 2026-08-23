import { FileText } from "lucide-react";
import EmptyState from "../../../../../shared/EmptyState";


const DescriptionTab = () => {
    return (
        <div className="py-10">
            <EmptyState
                icon={<FileText size={22} />}
                title="Description not yet available"
                description="This section is reserved for future description content and is not yet connected to any data."
            />
        </div>
    );
};

export default DescriptionTab;
