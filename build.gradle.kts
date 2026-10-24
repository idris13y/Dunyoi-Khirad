// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
  alias(libs.plugins.android.application) apply false
  alias(libs.plugins.kotlin.compose) apply false
  alias(libs.plugins.google.devtools.ksp) apply false
  alias(libs.plugins.secrets) apply false
  alias(libs.plugins.google.services) apply false
}

// Ensure the dev server on port 3000 is running for AI Studio web preview
fun ensureDevServerRunning() {
    try {
        val socket = java.net.Socket("127.0.0.1", 3000)
        socket.close()
    } catch (e: Exception) {
        val serverFile = file("server.js")
        if (serverFile.exists()) {
            ProcessBuilder("node", serverFile.absolutePath)
                .directory(rootDir)
                .redirectOutput(ProcessBuilder.Redirect.DISCARD)
                .redirectError(ProcessBuilder.Redirect.DISCARD)
                .start()
        }
    }
}
ensureDevServerRunning()
