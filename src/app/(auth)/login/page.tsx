



export {};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            div: any;
            h1: any;
            form: any;
            label: any;
            input: any;
            button: any;
        }
    }
}

export default function Login() {
    return (
        <>
        <div className="login-container">
            <h1>Welcome</h1>
            <form>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" placeholder="Enter your username" />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" placeholder="Enter your password" />
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    );
}
