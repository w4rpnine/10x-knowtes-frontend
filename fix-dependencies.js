import fs from "fs"

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"))

// Check if we're using react-day-picker
const usingDayPicker = packageJson.dependencies["react-day-picker"] !== undefined

if (usingDayPicker) {
  console.log("Your project is using react-day-picker, which requires date-fns v2.x or v3.x")
  console.log("Current date-fns version:", packageJson.dependencies["date-fns"])

  // Downgrade date-fns to a compatible version
  packageJson.dependencies["date-fns"] = "^3.6.0"

  console.log("Downgraded date-fns to:", packageJson.dependencies["date-fns"])

  // Write the updated package.json
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2))

  console.log("\nPackage.json has been updated. Please run:")
  console.log("npm install")
  console.log("or")
  console.log("yarn")
  console.log("\nto apply the changes.")
} else {
  console.log("Your project does not use react-day-picker. You can safely remove it:")
  console.log("npm uninstall react-day-picker")
  console.log("or")
  console.log("yarn remove react-day-picker")
}
