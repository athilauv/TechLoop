interface FooterProps {
    sidebarCollapsed: boolean;
}

const Footer = ({ sidebarCollapsed }: FooterProps) => {
    return (
        <footer
            className={`flex flex-col items-center justify-between gap-2 border-t border-[#223A59] px-6 py-4 text-xs text-[#5C7394] transition-all duration-200 ease-out sm:flex-row lg:px-8
            ${sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[264px]"}`}
        >
            <span>© {new Date().getFullYear()} TechLoop</span>
            <span>Admin Console · v1.0.0</span>
        </footer>
    );
};

export default Footer;