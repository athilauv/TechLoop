interface ContentHeaderProps {
    title: string;
    description?: string | null;
}

export default function ContentHeader({
                                          title,
                                          description,
                                      }: ContentHeaderProps) {
    return (
        <header className="border-b border-[#223A59] pb-7">
            <p className="text-sm font-medium text-[#00E8C2]">
                Learning
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
                {title}
            </h1>

            {description && (
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#8CA3BF]">
                    {description}
                </p>
            )}
        </header>
    );
}