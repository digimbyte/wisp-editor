mod cmd_build;
use cmd_build::compile_project;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Native directory picker command
#[tauri::command]
fn pick_directory() -> Result<Option<String>, String> {
    // For now, return a placeholder - we'll implement this properly once plugins are working
    Ok(Some("C:\\Users\\digimbyte\\Documents".to_string()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, compile_project, pick_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
