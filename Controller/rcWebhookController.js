exports.post = async (req, res) => {
    const { text, user_name } = req.body;

    if (user_name === "packageBot") {
        return res.sendStatus(200);
    }

    const match = text.match(/track (\w+)/);
    if (match) {
        const packageId = match[1];

        try {
            const response = await axios.get(`https://be-dev-api.mtktechlab.com/api/getPackages?package_id${packageId}`);
            const packageInfo = response.data;

            const reply = `Package ID: ${packageInfo.result.package_id}\npackage_type_name: ${packageInfo.result.package_type.package_type_name}`;
            return res.json({ text: reply });
        } catch (error) {
            return res.json({ text: `Error: Unable to find package with ID ${packageId}.` });
        }
    }

    return res.json({ text: "Please provide a valid package ID. Usage: `track <package_id>`" });
}
