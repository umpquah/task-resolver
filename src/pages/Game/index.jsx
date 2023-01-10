import { useState, useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import Config, { DEFAULT_CONFIG } from "../../config/index";

const Game = () => {  
    const [config, setConfig] = useState(null);
    const [status, setStatus] = useState("...");

    useEffect(() => {
        const initialConfig = new Config(DEFAULT_CONFIG);
        setConfig(initialConfig);
    }, []);

    const handleTest = () => {
        const result = config.evaluate("resultIsAward");
        console.log(result);
        setStatus(""  + config.evaluate("resultIsAward"));
    };

    return (
        <Container>
            <div style={{ width: "400px" }} className="mx-auto">
                <Button
                    variant="primary"
                    onClick={() => handleTest()}
                >
                    Test
                </Button>
                <div>
                    Status: {status}
                </div>
            </div>
        </Container>
    );
};

export default Game;

