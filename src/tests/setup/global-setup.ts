import {startDocker} from "../../tests/setup/docker-manager";

const setup = async () => {
    await startDocker()
}

export default setup