import ThemeToggle from "./ui-components/ThemeToggle";

export default function Header() {

    return (
        <header className="header justify-content-end">
            <div className="me-3">
                <ThemeToggle/>
            </div>
        </header>
    );
}
