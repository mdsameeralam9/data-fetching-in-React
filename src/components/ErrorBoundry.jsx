import { Fragment , Component} from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: ""
        };
    }

    static getDerivedStateFromError(error) {
        console.log('error', error)
        return {
            hasError: true,
            error: "Something went wrong"
        };
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        const { hasError, error } = this.state;
        const { children, fallback=null } = this.props;

        return (
            <>
                {hasError &&
                    <Fragment>
                        {fallback ? fallback :
                            <div className="wrapErrorcomponent">
                                <h1>{error}</h1>
                                <Link to="/">Go To Home</Link>
                            </div>
                        }
                    </Fragment>
                }
                {!hasError && children}
            </>
        );
    }
}

export default ErrorBoundary;
