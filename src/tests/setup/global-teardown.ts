import {stopDocker} from "../../tests/setup/docker-manager";

const teardown = async () => {
    await stopDocker()
}

export default teardown