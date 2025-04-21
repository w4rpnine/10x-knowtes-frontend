import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to search for vaul imports in files
function searchForVaulImports(dir, fileExtensions = [".js", ".jsx", ".ts", ".tsx"]) {
  const files = fs.readdirSync(dir)
  let usageFound = false

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== "node_modules" && file !== ".next") {
        const foundInSubdir = searchForVaulImports(filePath, fileExtensions)
        if (foundInSubdir) usageFound = true
      }
    } else if (fileExtensions.includes(path.extname(file))) {
      try {
        const content = fs.readFileSync(filePath, "utf8")
        if (content.includes("from 'vaul'") || content.includes('from "vaul"')) {
          console.log(`Found vaul import in: ${filePath}`)
          usageFound = true
        }
      } catch (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`)
      }
    }
  }

  return usageFound
}

// Start searching from the current directory
console.log("Searching for vaul imports in your project...")
const vaulUsageFound = searchForVaulImports(process.cwd())

if (!vaulUsageFound) {
  console.log("\nNo vaul imports found in your project.")
  console.log("You can safely remove vaul with:")
  console.log("npm uninstall vaul")
  console.log("\nOr you can downgrade React to version 18:")
  console.log("npm uninstall react react-dom")
  console.log("npm install react@18.2.0 react-dom@18.2.0")
} else {
  console.log("\nvaul imports found in your project.")
  console.log("Options:")
  console.log("1. Downgrade React to version 18:")
  console.log("   npm uninstall react react-dom")
  console.log("   npm install react@18.2.0 react-dom@18.2.0")
  console.log("\n2. Replace vaul with an alternative drawer/sheet component")
  console.log("\n3. Fork vaul and update it to support React 19")
}
