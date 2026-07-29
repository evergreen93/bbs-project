import "../../css/footer.css";

function Footer() {
    return (
        <footer className="office-footer">
            <div className="container office-footer-container">

                <div className="office-footer-left">
                    <div className="office-footer-logo">
                        <i className="fas fa-building"></i>
                    </div>

                    <div>
                        <h6>OfficeFlow</h6>
                        <p>Smart Work Management System</p>
                    </div>
                </div>

                <div className="office-footer-center">
                    <a href="/">TOP</a>
                </div>

                <div className="office-footer-right">
                    © 2026 OFFICEFLOW
                </div>

            </div>
        </footer>
    );
}

export default Footer;