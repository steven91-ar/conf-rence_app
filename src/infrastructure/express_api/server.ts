import expressApp from './app';

const PORT = process.env.PORT || 8000;

export const StartServer = async() => {
    expressApp.listen(PORT, () => {
        console.clear()
        console.log(`✅Server is running on port ${PORT}`)
    })

    process.on('uncaughtException', (err) => {
        console.log(`❌ Unhandled exception: ${err}`);
        process.exit(1)
    })
}

StartServer().then(() => {
    console.log("Server started")
});