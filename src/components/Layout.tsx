import Header from './Header';
import Nav from './Nav';
import './css/layout.css';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <Nav />
      <div className="main-section">
        <Header />
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}

