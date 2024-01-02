import './navBar.css';
import Logo from '../Logo/Logo';

export default function NavBar({ children }) {
    return (
      <nav className="nav-bar">
        <Logo />
        { children }
      </nav>
    );
}