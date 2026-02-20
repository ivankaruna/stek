import { defineConfig } from "cypress"
import { config } from "dotenv"

config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    env: {
      "baseUrl":process.env.BASE_URL,
      "login": process.env.LOGIN,
      "password": process.env.PASSWORD
    }
  }
})
