document.body.on("action:management:sync-all-data", async (event) => {
    console.log({event});
    await fetch("/api/management/sync-data", location);
})